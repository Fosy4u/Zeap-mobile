import IDynamicFilter from "../models/dynamicFilter_model";

const toParamKey = (name: string) => (name.charAt(0).toLowerCase() + name.slice(1)).replace(/\s+/g, "");

const buildFilterParams = (
    selectedFilters: Record<string, (string | number)[]>,
    dynamicFilterOptions: IDynamicFilter[] = [],
): Record<string, string> => {
    const slugFor = new Map<string, string>();
    dynamicFilterOptions.forEach((group) => {
        if (!Array.isArray(group.options)) { return; }
        group.options.forEach((option) => {
            if (option?.value != null && option?.slug) {
                slugFor.set(`${ group.name }::${ option.value }`, option.slug);
            }
        });
    });

    const params: Record<string, string> = {};
    Object.entries(selectedFilters).forEach(([groupName, values]) => {
        if (!values?.length) { return; }
        params[toParamKey(groupName)] = values
            .map((v) => slugFor.get(`${ groupName }::${ v }`) ?? String(v))
            .join(",");
    });
    return params;
};

export { toParamKey };
export default buildFilterParams;
