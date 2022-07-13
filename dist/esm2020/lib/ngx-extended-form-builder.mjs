import { FormGroup, FormArray, FormControl } from "@angular/forms";
import { Observable } from "rxjs";
function getValidatorsOrNull(key, keysValidator, addLift = false) {
    const result = keysValidator && keysValidator.has(key) ? keysValidator.get(key) : null;
    if (addLift) {
        if (result && Array.isArray(result)) {
            result.push(liftErrors);
            return result;
        }
        else {
            return result ? result : [liftErrors];
        }
    }
    else {
        return result;
    }
    ;
}
function makeFormGroup(source, internalKey, keysValidator, asyncKeysValidator) {
    return source instanceof (FormGroup) ?
        source :
        Object.entries(source).reduce((accumulator, entry) => {
            const key = entry[0];
            const value = entry[1];
            if (!(value instanceof Observable)) {
                accumulator.addControl(key, !!value && (value instanceof FormGroup || value instanceof FormArray || value instanceof (FormControl)) ?
                    value :
                    makeForm(value, makeNewMainFormValidatorsMap(key, keysValidator), makeNewMainFormValidatorsMap(key, asyncKeysValidator)));
            }
            ;
            return accumulator;
        }, new FormGroup({}, getValidatorsOrNull(internalKey, keysValidator, true), getValidatorsOrNull(internalKey, asyncKeysValidator, false)));
}
function makeNewMainFormValidatorsMap(key, oldMap) {
    if (!oldMap || key === 'mainFormValidators' || key === 'mainFormValidatorsItems') {
        return oldMap;
    }
    else {
        if (!oldMap.has(key) && !oldMap.has(`${key}Items`)) {
            return new Map(Array.from(oldMap.entries()).filter(item => item[0] !== 'mainFormValidators' && item[0] !== 'mainFormValidatorsItems').map(([entryKey, entryValue]) => [entryKey.startsWith(`${key}.`) ? entryKey.replace(`${key}.`, '') : entryKey, entryValue]));
        }
        else {
            const filterPredicate = oldMap.has('mainFormValidators') ?
                oldMap.has('mainFormValidatorsItems') ?
                    (item) => item[0] !== key && item[0] !== 'mainFormValidators' && item[0] !== 'mainFormValidatorsItems' :
                    (item) => item[0] !== key && item[0] !== 'mainFormValidators' :
                oldMap.has('mainFormValidatorsItems') ?
                    (item) => item[0] !== key && item[0] !== 'mainFormValidatorsItems' :
                    (item) => item[0] !== key;
            const newMainValidatorsArray = oldMap.has(key) ?
                oldMap.has(`${key}Items`) ?
                    [
                        ['mainFormValidators', oldMap.get(key)],
                        ['mainFormValidatorsItems', oldMap.get(`${key}Items`)]
                    ] :
                    [
                        ['mainFormValidators', oldMap.get(key)],
                    ] :
                oldMap.has(`${key}Items`) ?
                    [
                        ['mainFormValidatorsItems', oldMap.get(`${key}Items`)]
                    ] :
                    [];
            return new Map([
                ...newMainValidatorsArray,
                ...Array.from(oldMap.entries()).filter(filterPredicate).map(([entryKey, entryValue]) => [entryKey.startsWith(`${key}.`) ? entryKey.replace(`${key}.`, '') : entryKey, entryValue])
            ]);
        }
        ;
    }
    ;
}
export function makeForm(source, keysValidator, asyncKeysValidator) {
    const form = !!source && (typeof source === 'object' || typeof source === 'function') ?
        source instanceof (Array) ?
            new FormArray(source.map((item) => {
                const itemForm = makeForm(item, makeNewMainFormValidatorsMap('mainFormValidatorsItems', keysValidator), makeNewMainFormValidatorsMap('mainFormValidatorsItems', asyncKeysValidator));
                return itemForm;
            }), getValidatorsOrNull('mainFormValidators', keysValidator, true), getValidatorsOrNull('mainFormValidators', asyncKeysValidator, false)) :
            makeFormGroup(source, 'mainFormValidators', keysValidator, asyncKeysValidator) :
        new FormControl(!!source && typeof source == 'string' && (source.includes('0001-01-01') || source.includes('1970-01-01')) ? null : source, getValidatorsOrNull('mainFormValidators', keysValidator, false), getValidatorsOrNull('mainFormValidators', asyncKeysValidator, false));
    return form;
}
;
function liftErrors(control) {
    if (control instanceof FormControl) {
        return null;
    }
    else {
        const allControls = control instanceof FormGroup ?
            Object.values(control.controls) :
            control instanceof FormArray ?
                control.controls :
                [];
        const invalidControls = allControls.filter(control => control.status === 'INVALID');
        return invalidControls.length === 0 ? null : invalidControls.reduce((accumulator, current) => {
            if (current.errors) {
                addValidationErrors(current.errors, accumulator);
            }
            ;
            return accumulator;
        }, {});
    }
}
export function liftValidationErrors(control) {
    const allControls = control instanceof FormGroup ?
        Object.values(control.controls) :
        control instanceof FormArray ?
            control.controls :
            [];
    const invalidControls = allControls.filter(control => control.status === 'INVALID');
    const errors = invalidControls.length === 0 ? {} : invalidControls.reduce((accumulator, current) => {
        if (current.errors) {
            addValidationErrors(current.errors, accumulator);
        }
        ;
        const innerErrors = liftValidationErrors(current);
        if (innerErrors) {
            addValidationErrors(innerErrors, accumulator);
        }
        ;
        return accumulator;
    }, {});
    return Object.values(errors).length === 0 ? null : errors;
}
;
function addValidationErrors(additionErrors, currentErrors) {
    Object.entries(additionErrors).forEach(entry => currentErrors[entry[0]] = entry[1]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWV4dGVuZGVkLWZvcm0tYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1mb3JtLWJ1aWxkZXIvc3JjL2xpYi9uZ3gtZXh0ZW5kZWQtZm9ybS1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5FLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUF5Q2xDLFNBQVMsbUJBQW1CLENBQzFCLEdBQVcsRUFBRSxhQUE4QixFQUFFLFVBQW1CLEtBQUs7SUFFckUsTUFBTSxNQUFNLEdBQUcsYUFBYSxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN2RixJQUFJLE9BQU8sRUFBRTtRQUNYLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEIsTUFBTyxDQUFDLElBQUksQ0FBZSxVQUFVLENBQUMsQ0FBQztZQUN4RCxPQUFXLE1BQU0sQ0FBQztTQUNuQjthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUksQ0FBRSxVQUFVLENBQUUsQ0FBQztTQUM1QztLQUNGO1NBQU07UUFDTCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQUEsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FDcEIsTUFBUyxFQUNULFdBQW1CLEVBQ25CLGFBQTJELEVBQzNELGtCQUFxRTtJQUVyRSxPQUFPLE1BQU0sYUFBWSxTQUFzRCxDQUFBLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsQ0FBQztRQUNrRCxNQUFNLENBQUMsT0FB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QyxhQUFhLENBQUUsS0FBSyxDQUFFLENBQUMsQ0FBRSxDQUFFLEdBQUcsS0FBSyxDQUFFLENBQUMsQ0FBRSxDQUNsRCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybUFycmF5LCBGb3JtQ29udHJvbCB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHR5cGUgeyBWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgQXN5bmNWYWxpZGF0b3JGbiwgQWJzdHJhY3RDb250cm9sIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcblxuZXhwb3J0IHR5cGUgQ29udHJvbHNOYW1lczxUPiA9ICdtYWluRm9ybVZhbGlkYXRvcnMnIHwgUHJvcGVydHllc0tleXM8VD47XG5cbnR5cGUgUHJvcGVydHllc0tleXM8VD4gPSBUIGV4dGVuZHMgdW5kZWZpbmVkIHwgbnVsbCB8IG51bWJlciB8IGJvb2xlYW4gfCBzeW1ib2wgP1xuICBuZXZlciA6XG4gIFQgZXh0ZW5kcyBzdHJpbmcgP1xuICBUIDpcbiAgVCBleHRlbmRzIEFycmF5PGluZmVyIFU+ID8gUHJvcGVydHllc0tleXM8VT4gOlxuICB7XG4gICAgWyBLIGluIGtleW9mIFQgXS0/OiBLIGV4dGVuZHMgc3RyaW5nID9cbiAgICBUWyBLIF0gZXh0ZW5kcyAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHN5bWJvbCkgP1xuICAgIEsgOlxuICAgIFRbIEsgXSBleHRlbmRzIEFycmF5PGluZmVyIFU+ID9cbiAgICBLIHwgYCR7IEsgfS4keyBQcm9wZXJ0eWVzS2V5czxVPiB9YCA6XG4gICAgVFsgSyBdIGV4dGVuZHMgdW5kZWZpbmVkIHwgbnVsbCA/XG4gICAgSyA6XG4gICAgVFsgSyBdIGV4dGVuZHMgT2JzZXJ2YWJsZTxhbnk+ID9cbiAgICBuZXZlciA6XG4gICAgSyB8IGAkeyBLIH0uJHsgUHJvcGVydHllc0tleXM8VFsgSyBdPiB9YCA6XG4gICAgbmV2ZXJcbiAgfVsga2V5b2YgVCBdO1xuXG50eXBlIEFycmF5RWxlbWVudDxUPiA9IFQgZXh0ZW5kcyBBcnJheTxpbmZlciBVPiA/IFUgOiBuZXZlcjtcbmV4cG9ydCB0eXBlIEZvcm1Hcm91cFR5cGU8VD4gPSBGb3JtR3JvdXA8eyBbIEsgaW4gKGtleW9mIFQgJiBzdHJpbmcpIF06IFNjYW5Gb3JtVHlwZTxUWyBLIF0+OyB9PjtcblxuZXhwb3J0IHR5cGUgU2NhbkZvcm1UeXBlPFQ+ID0gVCBleHRlbmRzIEZvcm1Hcm91cDxpbmZlciBVPiA/XG4gIEZvcm1Hcm91cDxVPiA6XG4gIFQgZXh0ZW5kcyBGb3JtQXJyYXk8aW5mZXIgVT4gP1xuICBGb3JtQXJyYXk8VT4gOlxuICBUIGV4dGVuZHMgRm9ybUNvbnRyb2w8aW5mZXIgVT4gP1xuICBGb3JtQ29udHJvbDxVPiA6XG4gIFQgZXh0ZW5kcyBBcnJheTxpbmZlciBVPiA/XG4gIEZvcm1BcnJheTxTY2FuRm9ybVR5cGU8VT4+IDpcbiAgVCBleHRlbmRzIG51bGwgfCB1bmRlZmluZWQgP1xuICBuZXZlciA6XG4gIFQgZXh0ZW5kcyAoc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHN5bWJvbCB8IG51bGwgfCB1bmRlZmluZWQpID8gRm9ybUNvbnRyb2w8VCB8IG51bGw+IDpcbiAgRm9ybUdyb3VwVHlwZTxUPjtcblxudHlwZSBJbm5lclR5cGU8VCwgSyBleHRlbmRzIGtleW9mIFQ+ID0gVFsgSyBdO1xuXG5mdW5jdGlvbiBnZXRWYWxpZGF0b3JzT3JOdWxsPFQgZXh0ZW5kcyBWYWxpZGF0b3JGbltdIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbD4oXG4gIGtleTogc3RyaW5nLCBrZXlzVmFsaWRhdG9yPzogTWFwPHN0cmluZywgVD4sIGFkZExpZnQ6IGJvb2xlYW4gPSBmYWxzZVxuKTogVCB8IHVuZGVmaW5lZCB8IG51bGwge1xuICBjb25zdCByZXN1bHQgPSBrZXlzVmFsaWRhdG9yICYmIGtleXNWYWxpZGF0b3IuaGFzKGtleSkgPyBrZXlzVmFsaWRhdG9yLmdldChrZXkpIDogbnVsbDtcbiAgaWYgKGFkZExpZnQpIHtcbiAgICBpZiAocmVzdWx0ICYmIEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgKDxWYWxpZGF0b3JGbltdPiByZXN1bHQpLnB1c2goPFZhbGlkYXRvckZuPiBsaWZ0RXJyb3JzKTtcbiAgICAgIHJldHVybiA8VD4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0IDogPFQ+WyBsaWZ0RXJyb3JzIF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VGb3JtR3JvdXA8VD4oXG4gIHNvdXJjZTogVCxcbiAgaW50ZXJuYWxLZXk6IHN0cmluZyxcbiAga2V5c1ZhbGlkYXRvcj86IE1hcDxDb250cm9sc05hbWVzPFQ+LCBWYWxpZGF0b3JGbltdIHwgbnVsbD4sXG4gIGFzeW5jS2V5c1ZhbGlkYXRvcj86IE1hcDxDb250cm9sc05hbWVzPFQ+LCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsPlxuKTogRm9ybUdyb3VwVHlwZTxUPiB7XG4gIHJldHVybiBzb3VyY2UgaW5zdGFuY2VvZiBGb3JtR3JvdXA8eyBbIEsgaW4ga2V5b2YgVCBdOiBTY2FuRm9ybVR5cGU8VFsgSyBdPjsgfT4gP1xuICAgIHNvdXJjZSA6XG4gICAgKDxbIHN0cmluZyAmIGtleW9mIFQsIElubmVyVHlwZTxULCBzdHJpbmcgJiBrZXlvZiBUPiBdW10+IE9iamVjdC5lbnRyaWVzKHNvdXJjZSkpLnJlZHVjZShcbiAgICAgIChhY2N1bXVsYXRvcjogRm9ybUdyb3VwLCBlbnRyeTogWyBzdHJpbmcgJiBrZXlvZiBULCBJbm5lclR5cGU8VCwgc3RyaW5nICYga2V5b2YgVD4gXSkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBlbnRyeVsgMCBdO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGVudHJ5WyAxIF07XG4gICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkpIHtcbiAgICAgICAgICBhY2N1bXVsYXRvci5hZGRDb250cm9sKFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgISF2YWx1ZSAmJiAoXG4gICAgICAgICAgICAgIHZhbHVlIGluc3RhbmNlb2YgRm9ybUdyb3VwIHx8IHZhbHVlIGluc3RhbmNlb2YgRm9ybUFycmF5IHx8IHZhbHVlIGluc3RhbmNlb2YgRm9ybUNvbnRyb2w8SW5uZXJUeXBlPFQsIHN0cmluZyAmIGtleW9mIFQ+IHwgbnVsbD5cbiAgICAgICAgICAgICkgP1xuICAgICAgICAgICAgICA8U2NhbkZvcm1UeXBlPElubmVyVHlwZTxULCBzdHJpbmcgJiBrZXlvZiBUPj4+IDx1bmtub3duPiB2YWx1ZSA6XG4gICAgICAgICAgICAgIG1ha2VGb3JtPElubmVyVHlwZTxULCBzdHJpbmcgJiBrZXlvZiBUPj4oXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgPE1hcDxDb250cm9sc05hbWVzPElubmVyVHlwZTxULCBzdHJpbmcgJiBrZXlvZiBUPj4sIFZhbGlkYXRvckZuW10gfCBudWxsPj4gbWFrZU5ld01haW5Gb3JtVmFsaWRhdG9yc01hcDxWYWxpZGF0b3JGbltdIHwgbnVsbCwgVD4oa2V5LCBrZXlzVmFsaWRhdG9yKSxcbiAgICAgICAgICAgICAgICA8TWFwPENvbnRyb2xzTmFtZXM8SW5uZXJUeXBlPFQsIHN0cmluZyAmIGtleW9mIFQ+PiwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbD4+IG1ha2VOZXdNYWluRm9ybVZhbGlkYXRvcnNNYXA8QXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCwgVD4oa2V5LCBhc3luY0tleXNWYWxpZGF0b3IpLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIDxGb3JtR3JvdXBUeXBlPFQ+PiBhY2N1bXVsYXRvcjtcbiAgICAgIH0sIG5ldyBGb3JtR3JvdXA8eyBbIEsgaW4ga2V5b2YgVCBdOiBTY2FuRm9ybVR5cGU8VFsgSyBdPjsgfT4oPHsgWyBLIGluIGtleW9mIFQgXTogU2NhbkZvcm1UeXBlPFRbIEsgXT47IH0+IHt9LFxuICAgICAgICBnZXRWYWxpZGF0b3JzT3JOdWxsKGludGVybmFsS2V5LCBrZXlzVmFsaWRhdG9yLCB0cnVlKSxcbiAgICAgICAgZ2V0VmFsaWRhdG9yc09yTnVsbChpbnRlcm5hbEtleSwgYXN5bmNLZXlzVmFsaWRhdG9yLCBmYWxzZSlcbiAgICAgIClcbiAgICApO1xufVxuXG5mdW5jdGlvbiBtYWtlTmV3TWFpbkZvcm1WYWxpZGF0b3JzTWFwPFQgZXh0ZW5kcyBWYWxpZGF0b3JGbltdIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCwgUD4oXG4gIGtleTogc3RyaW5nICYga2V5b2YgUCwgb2xkTWFwPzogTWFwPHN0cmluZywgVD4sXG4pOiBNYXA8c3RyaW5nLCBUPiB8IHVuZGVmaW5lZCB7XG4gIGlmICghb2xkTWFwIHx8IGtleSA9PT0gJ21haW5Gb3JtVmFsaWRhdG9ycycgfHwga2V5ID09PSAnbWFpbkZvcm1WYWxpZGF0b3JzSXRlbXMnKSB7XG4gICAgcmV0dXJuIG9sZE1hcDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIW9sZE1hcC5oYXMoa2V5KSAmJiAhb2xkTWFwLmhhcyhgJHsga2V5IH1JdGVtc2ApKSB7XG4gICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFQ+KFxuICAgICAgICBBcnJheS5mcm9tKFxuICAgICAgICAgIG9sZE1hcC5lbnRyaWVzKClcbiAgICAgICAgKS5maWx0ZXIoXG4gICAgICAgICAgaXRlbSA9PiBpdGVtWyAwIF0gIT09ICdtYWluRm9ybVZhbGlkYXRvcnMnICYmIGl0ZW1bIDAgXSAhPT0gJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJ1xuICAgICAgICApLm1hcChcbiAgICAgICAgICAoWyBlbnRyeUtleSwgZW50cnlWYWx1ZSBdKSA9PiBbIGVudHJ5S2V5LnN0YXJ0c1dpdGgoYCR7IGtleSB9LmApID8gZW50cnlLZXkucmVwbGFjZShgJHsga2V5IH0uYCwgJycpIDogZW50cnlLZXksIGVudHJ5VmFsdWUgXVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaWx0ZXJQcmVkaWNhdGUgPSBvbGRNYXAuaGFzKCdtYWluRm9ybVZhbGlkYXRvcnMnKSA/XG4gICAgICAgIG9sZE1hcC5oYXMoJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJykgP1xuICAgICAgICAgIChpdGVtOiBbIHN0cmluZywgVCBdKSA9PiBpdGVtWyAwIF0gIT09IGtleSAmJiBpdGVtWyAwIF0gIT09ICdtYWluRm9ybVZhbGlkYXRvcnMnICYmIGl0ZW1bIDAgXSAhPT0gJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJyA6XG4gICAgICAgICAgKGl0ZW06IFsgc3RyaW5nLCBUIF0pID0+IGl0ZW1bIDAgXSAhPT0ga2V5ICYmIGl0ZW1bIDAgXSAhPT0gJ21haW5Gb3JtVmFsaWRhdG9ycycgOlxuICAgICAgICBvbGRNYXAuaGFzKCdtYWluRm9ybVZhbGlkYXRvcnNJdGVtcycpID9cbiAgICAgICAgICAoaXRlbTogWyBzdHJpbmcsIFQgXSkgPT4gaXRlbVsgMCBdICE9PSBrZXkgJiYgaXRlbVsgMCBdICE9PSAnbWFpbkZvcm1WYWxpZGF0b3JzSXRlbXMnIDpcbiAgICAgICAgICAoaXRlbTogWyBzdHJpbmcsIFQgXSkgPT4gaXRlbVsgMCBdICE9PSBrZXk7XG4gICAgICBjb25zdCBuZXdNYWluVmFsaWRhdG9yc0FycmF5OiBbIHN0cmluZywgVCBdW10gPSBvbGRNYXAuaGFzKGtleSkgP1xuICAgICAgICBvbGRNYXAuaGFzKGAkeyBrZXkgfUl0ZW1zYCkgP1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFsgJ21haW5Gb3JtVmFsaWRhdG9ycycsIG9sZE1hcC5nZXQoa2V5KSEgXSxcbiAgICAgICAgICAgIFsgJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJywgb2xkTWFwLmdldChgJHsga2V5IH1JdGVtc2ApISBdXG4gICAgICAgICAgXSA6XG4gICAgICAgICAgW1xuICAgICAgICAgICAgWyAnbWFpbkZvcm1WYWxpZGF0b3JzJywgb2xkTWFwLmdldChrZXkpISBdLFxuICAgICAgICAgIF0gOlxuICAgICAgICBvbGRNYXAuaGFzKGAkeyBrZXkgfUl0ZW1zYCkgP1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFsgJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJywgb2xkTWFwLmdldChgJHsga2V5IH1JdGVtc2ApISBdXG4gICAgICAgICAgXSA6XG4gICAgICAgICAgW107XG4gICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFQ+KFtcbiAgICAgICAgLi4ubmV3TWFpblZhbGlkYXRvcnNBcnJheSxcbiAgICAgICAgLi4uQXJyYXkuZnJvbShcbiAgICAgICAgICBvbGRNYXAuZW50cmllcygpXG4gICAgICAgICkuZmlsdGVyKGZpbHRlclByZWRpY2F0ZSkubWFwPFsgc3RyaW5nLCBUIF0+KFxuICAgICAgICAgIChbIGVudHJ5S2V5LCBlbnRyeVZhbHVlIF0pID0+IFsgZW50cnlLZXkuc3RhcnRzV2l0aChgJHsga2V5IH0uYCkgPyBlbnRyeUtleS5yZXBsYWNlKGAkeyBrZXkgfS5gLCAnJykgOiBlbnRyeUtleSwgZW50cnlWYWx1ZSBdXG4gICAgICAgIClcbiAgICAgIF0pO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRm9ybTxUPihcbiAgc291cmNlOiBULFxuICBrZXlzVmFsaWRhdG9yPzogTWFwPENvbnRyb2xzTmFtZXM8VD4sIFZhbGlkYXRvckZuW10gfCBudWxsPixcbiAgYXN5bmNLZXlzVmFsaWRhdG9yPzogTWFwPENvbnRyb2xzTmFtZXM8VD4sIEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGw+LFxuKTogU2NhbkZvcm1UeXBlPFQ+IHtcbiAgY29uc3QgZm9ybSA9ICEhc291cmNlICYmICh0eXBlb2Ygc291cmNlID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygc291cmNlID09PSAnZnVuY3Rpb24nKSA/XG4gICAgc291cmNlIGluc3RhbmNlb2YgQXJyYXk8QXJyYXlFbGVtZW50PFQ+PiA/XG4gICAgICBuZXcgRm9ybUFycmF5KFxuICAgICAgICBzb3VyY2UubWFwKFxuICAgICAgICAgIChpdGVtOiBBcnJheUVsZW1lbnQ8VD4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Gb3JtID0gbWFrZUZvcm0oXG4gICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgIDxNYXA8Q29udHJvbHNOYW1lczxBcnJheUVsZW1lbnQ8VD4+LCBWYWxpZGF0b3JGbltdIHwgbnVsbD4+IG1ha2VOZXdNYWluRm9ybVZhbGlkYXRvcnNNYXAoJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJywga2V5c1ZhbGlkYXRvciksXG4gICAgICAgICAgICAgIDxNYXA8Q29udHJvbHNOYW1lczxBcnJheUVsZW1lbnQ8VD4+LCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsPj4gbWFrZU5ld01haW5Gb3JtVmFsaWRhdG9yc01hcCgnbWFpbkZvcm1WYWxpZGF0b3JzSXRlbXMnLCBhc3luY0tleXNWYWxpZGF0b3IpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1Gb3JtO1xuICAgICAgICAgIH0pLFxuICAgICAgICBnZXRWYWxpZGF0b3JzT3JOdWxsKCdtYWluRm9ybVZhbGlkYXRvcnMnLCBrZXlzVmFsaWRhdG9yLCB0cnVlKSxcbiAgICAgICAgZ2V0VmFsaWRhdG9yc09yTnVsbCgnbWFpbkZvcm1WYWxpZGF0b3JzJywgYXN5bmNLZXlzVmFsaWRhdG9yLCBmYWxzZSlcbiAgICAgICkgOlxuICAgICAgbWFrZUZvcm1Hcm91cDxUPihzb3VyY2UsICdtYWluRm9ybVZhbGlkYXRvcnMnLCBrZXlzVmFsaWRhdG9yLCBhc3luY0tleXNWYWxpZGF0b3IpIDpcbiAgICBuZXcgRm9ybUNvbnRyb2w8VCB8IG51bGw+KFxuICAgICAgISFzb3VyY2UgJiYgdHlwZW9mIHNvdXJjZSA9PSAnc3RyaW5nJyAmJiAoc291cmNlLmluY2x1ZGVzKCcwMDAxLTAxLTAxJykgfHwgc291cmNlLmluY2x1ZGVzKCcxOTcwLTAxLTAxJykpID8gbnVsbCA6IHNvdXJjZVxuICAgICAgLFxuICAgICAgZ2V0VmFsaWRhdG9yc09yTnVsbCgnbWFpbkZvcm1WYWxpZGF0b3JzJywga2V5c1ZhbGlkYXRvciwgZmFsc2UpLFxuICAgICAgZ2V0VmFsaWRhdG9yc09yTnVsbCgnbWFpbkZvcm1WYWxpZGF0b3JzJywgYXN5bmNLZXlzVmFsaWRhdG9yLCBmYWxzZSlcbiAgICApO1xuICByZXR1cm4gPFNjYW5Gb3JtVHlwZTxUPj4gZm9ybTtcbn07XG5cbmZ1bmN0aW9uIGxpZnRFcnJvcnMoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICBpZiAoY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYWxsQ29udHJvbHMgPSBjb250cm9sIGluc3RhbmNlb2YgRm9ybUdyb3VwID9cbiAgICAgIE9iamVjdC52YWx1ZXMoY29udHJvbC5jb250cm9scykgOlxuICAgICAgY29udHJvbCBpbnN0YW5jZW9mIEZvcm1BcnJheSA/XG4gICAgICAgIGNvbnRyb2wuY29udHJvbHMgOlxuICAgICAgICBbXTtcbiAgICBjb25zdCBpbnZhbGlkQ29udHJvbHMgPSBhbGxDb250cm9scy5maWx0ZXIoY29udHJvbCA9PiBjb250cm9sLnN0YXR1cyA9PT0gJ0lOVkFMSUQnKTtcbiAgICByZXR1cm4gaW52YWxpZENvbnRyb2xzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBpbnZhbGlkQ29udHJvbHMucmVkdWNlKFxuICAgICAgKGFjY3VtdWxhdG9yLCBjdXJyZW50KSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50LmVycm9ycykge1xuICAgICAgICAgIGFkZFZhbGlkYXRpb25FcnJvcnMoY3VycmVudC5lcnJvcnMsIGFjY3VtdWxhdG9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgfSwgPFZhbGlkYXRpb25FcnJvcnM+IHt9XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlmdFZhbGlkYXRpb25FcnJvcnMoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICBjb25zdCBhbGxDb250cm9scyA9IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtR3JvdXAgP1xuICAgIE9iamVjdC52YWx1ZXMoY29udHJvbC5jb250cm9scykgOlxuICAgIGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQXJyYXkgP1xuICAgICAgY29udHJvbC5jb250cm9scyA6XG4gICAgICBbXTtcbiAgY29uc3QgaW52YWxpZENvbnRyb2xzID0gYWxsQ29udHJvbHMuZmlsdGVyKGNvbnRyb2wgPT4gY29udHJvbC5zdGF0dXMgPT09ICdJTlZBTElEJyk7XG4gIGNvbnN0IGVycm9yczogVmFsaWRhdGlvbkVycm9ycyA9IGludmFsaWRDb250cm9scy5sZW5ndGggPT09IDAgPyB7fSA6IGludmFsaWRDb250cm9scy5yZWR1Y2UoXG4gICAgKGFjY3VtdWxhdG9yLCBjdXJyZW50KSA9PiB7XG4gICAgICBpZiAoY3VycmVudC5lcnJvcnMpIHtcbiAgICAgICAgYWRkVmFsaWRhdGlvbkVycm9ycyhjdXJyZW50LmVycm9ycywgYWNjdW11bGF0b3IpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGlubmVyRXJyb3JzID0gbGlmdFZhbGlkYXRpb25FcnJvcnMoY3VycmVudCk7XG4gICAgICBpZiAoaW5uZXJFcnJvcnMpIHtcbiAgICAgICAgYWRkVmFsaWRhdGlvbkVycm9ycyhpbm5lckVycm9ycywgYWNjdW11bGF0b3IpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICB9LCA8VmFsaWRhdGlvbkVycm9ycz4ge31cbiAgKTtcbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZXJyb3JzKS5sZW5ndGggPT09IDAgPyBudWxsIDogZXJyb3JzO1xufTtcblxuZnVuY3Rpb24gYWRkVmFsaWRhdGlvbkVycm9ycyhhZGRpdGlvbkVycm9yczogVmFsaWRhdGlvbkVycm9ycywgY3VycmVudEVycm9yczogVmFsaWRhdGlvbkVycm9ycykge1xuICBPYmplY3QuZW50cmllcyhhZGRpdGlvbkVycm9ycykuZm9yRWFjaChcbiAgICBlbnRyeSA9PiBjdXJyZW50RXJyb3JzWyBlbnRyeVsgMCBdIF0gPSBlbnRyeVsgMSBdXG4gICk7XG59Il19