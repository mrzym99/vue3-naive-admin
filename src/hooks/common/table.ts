import { computed, effectScope, onScopeDispose, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { useBoolean, useHookTable } from '@sa/hooks';
import type { RowKey } from 'naive-ui/es/data-table/src/interface';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

type TableData = NaiveUI.TableData;
type GetTableData<A extends NaiveUI.TableApiFn> = NaiveUI.GetTableData<A>;
type TableColumn<T> = NaiveUI.TableColumn<T>;

export function useTable<A extends NaiveUI.TableApiFn>(config: NaiveUI.NaiveTableConfig<A>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const isMobile = computed(() => appStore.isMobile);
  const scrollX = ref(0);

  const { apiFn, apiParams, immediate, showTotal, isTreeTable, expandAll = false } = config;

  const SELECTION_KEY = '__selection__';

  const EXPAND_KEY = '__expand__';

  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams,
    toggleExpand,
    expandedRowKeys
  } = useHookTable<A, GetTableData<A>, TableColumn<NaiveUI.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: res => {
      const { list = [], currentPage = 1, pageSize = 10, total = 0 } = res.data || {};

      const listWithIndex = list.map((item: any, index: number) => {
        return {
          ...item,
          index: (currentPage - 1) * pageSize + index + 1
        };
      });

      return {
        data: listWithIndex,
        pageNum: currentPage,
        pageSize,
        total
      };
    },
    getColumnChecks: cols => {
      const checks: NaiveUI.TableColumnCheck[] = [];

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          checks.push({
            key: column.key as string,
            title: column.title as string,
            checked: true
          });
        } else if (column.type === 'selection') {
          checks.push({
            key: SELECTION_KEY,
            title: $t('common.check'),
            checked: true
          });
        } else if (column.type === 'expand') {
          checks.push({
            key: EXPAND_KEY,
            title: $t('common.expandColumn'),
            checked: true
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<GetTableData<A>>>();

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          columnMap.set(column.key as string, column);
        } else if (column.type === 'selection') {
          columnMap.set(SELECTION_KEY, column);
        } else if (column.type === 'expand') {
          columnMap.set(EXPAND_KEY, column);
        }
      });

      const filteredColumns = checks
        .filter(item => item.checked)
        .map(check => columnMap.get(check.key) as TableColumn<GetTableData<A>>);

      return filteredColumns;
    },
    onFetched: async transformed => {
      const { pageNum, pageSize, total } = transformed;

      updatePagination({
        page: pageNum,
        pageSize,
        itemCount: total
      });
    },
    immediate,
    expandAll
  });

  const pagination: PaginationProps = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    itemCount: 0,
    pageSizes: [10, 15, 20, 25, 30],
    onUpdatePage: async (page: number) => {
      pagination.page = page;

      updateSearchParams({
        currentPage: page,
        pageSize: pagination.pageSize!
      });

      getData();
    },
    onUpdatePageSize: async (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;

      updateSearchParams({
        currentPage: pagination.page,
        pageSize
      });

      getData();
    },
    ...(showTotal
      ? {
          prefix: page => $t('datatable.itemCount', { total: page.itemCount })
        }
      : {})
  });

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: PaginationProps = {
      ...pagination,
      pageSlot: isMobile.value ? 3 : 9,
      prefix: !isMobile.value && showTotal ? pagination.prefix : undefined
    };

    return p;
  });

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);
  }

  /**
   * get data by page number
   *
   * @param pageNum the page number. default is 1
   */
  async function getDataByPage(pageNum: number = 1) {
    updatePagination({
      page: pageNum
    });

    updateSearchParams({
      currentPage: pageNum,
      pageSize: pagination.pageSize!
    });

    await getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  scrollX.value = getScrollX(columns.value);

  function getScrollX(arr: NaiveUI.TableColumn<any>[]) {
    return arr.reduce((acc, column) => {
      if (column.width) {
        return acc + Number(column.width);
      }
      if (column.minWidth) {
        return acc + Number(column.minWidth);
      }
      return acc;
    }, 0);
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams,
    toggleExpand,
    expandedRowKeys,
    isTreeTable,
    expandAll,
    scrollX
  };
}

export function useTableOperate<T extends TableData = TableData>(data: Ref<T[]>, getData: () => Promise<void>) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();
  const { bool: modelVisible, setTrue: openModal, setFalse: closeModal } = useBoolean();

  const operateType = ref<NaiveUI.TableOperateType>('add');

  const addingData = ref<T | null>(null);
  /** the editing row data */
  const editingData: Ref<T | null> = ref(null);
  /** the detail row data */
  const detailData: Ref<T | null> = ref(null);

  function handleAdd(addData?: Record<string, any>) {
    operateType.value = 'add';
    addingData.value = addData;
    openDrawer();
  }

  function flatData(treeData: T[]): T[] {
    return treeData.reduce((pre: T[], cur: T) => {
      return pre.concat(cur, cur.children && cur.children.length ? flatData(cur.children as T[]) : []);
    }, [] as T[]);
  }

  function handleEdit(id: T['id'], detail?: T) {
    operateType.value = 'edit';
    const flatTableData = flatData(data.value);
    const findItem = flatTableData.find(item => item.id === id) || null;
    editingData.value = jsonClone(findItem);

    if (detail) {
      editingData.value = {
        ...editingData.value,
        ...detail
      };
    }

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = ref<RowKey[]>([]);

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  function handleDetail(id: T['id'], detail?: T) {
    const flatTableData = flatData(data.value);
    const findItem = flatTableData.find(item => item.id === id) || null;
    detailData.value = jsonClone(findItem);

    if (detail) {
      detailData.value = {
        ...detailData.value,
        ...detail
      };
    }
    openModal();
  }

  return {
    modelVisible,
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    addingData,
    editingData,
    detailData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted,
    handleDetail,
    closeModal
  };
}

function isTableColumnHasKey<T>(column: TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}
