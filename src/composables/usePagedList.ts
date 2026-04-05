import {onMounted, ref, toValue, watch, type MaybeRefOrGetter, type Ref} from 'vue';
import type {pageInfoReq} from '@/stores/type';

interface UsePagedListOptions<TRequest extends pageInfoReq, TData, TItem> {
    initialRequest: MaybeRefOrGetter<TRequest>;
    fetcher: (request: TRequest) => Promise<TData>;
    selectItems: (data: TData) => TItem[];
    selectTotal: (data: TData) => number;
}

export function usePagedList<TRequest extends pageInfoReq, TData, TItem>(
    options: UsePagedListOptions<TRequest, TData, TItem>,
) {
    const request = ref({...toValue(options.initialRequest)}) as Ref<TRequest>;
    const items = ref<TItem[]>([]);
    const total = ref(0);
    const loading = ref(false);

    const load = async () => {
        loading.value = true;
        try {
            const data = await options.fetcher(request.value);
            items.value = options.selectItems(data) ?? [];
            total.value = options.selectTotal(data) ?? 0;
        } catch (error) {
            items.value = [];
            total.value = 0;
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const handleSizeChange = (size: number) => {
        request.value = {...request.value, size, page: 1};
        void load();
    };

    const handleCurrentChange = (page: number) => {
        request.value = {...request.value, page};
        void load();
    };

    watch(
        () => toValue(options.initialRequest),
        (next) => {
            request.value = {...next} as TRequest;
            void load();
        },
        {deep: true},
    );

    onMounted(() => {
        void load();
    });

    return {
        request,
        items,
        total,
        loading,
        load,
        handleSizeChange,
        handleCurrentChange,
    };
}
