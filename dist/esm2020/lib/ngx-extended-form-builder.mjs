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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWV4dGVuZGVkLWZvcm0tYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Byb2plY3RzL25neC1leHRlbmRlZC1mb3JtLWJ1aWxkZXIvc3JjL2xpYi9uZ3gtZXh0ZW5kZWQtZm9ybS1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5FLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFtQmxDLFNBQVMsbUJBQW1CLENBQzFCLEdBQVcsRUFBRSxhQUE4QixFQUFFLFVBQW1CLEtBQUs7SUFFckUsTUFBTSxNQUFNLEdBQUcsYUFBYSxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN2RixJQUFJLE9BQU8sRUFBRTtRQUNYLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEIsTUFBTyxDQUFDLElBQUksQ0FBZSxVQUFVLENBQUMsQ0FBQztZQUN4RCxPQUFXLE1BQU0sQ0FBQztTQUNuQjthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUksQ0FBRSxVQUFVLENBQUUsQ0FBQztTQUM1QztLQUNGO1NBQU07UUFDTCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQUEsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FDcEIsTUFBUyxFQUNULFdBQW1CLEVBQ25CLGFBQWlELEVBQ2pELGtCQUEyRDtJQUUzRCxPQUFPLE1BQU0sYUFBWSxTQUFzRCxDQUFBLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsQ0FBQztRQUNrRCxNQUFNLENBQUMsT0FB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YSxDQUFFLEtBQUssQ0FBRSxDQUFDLENBQUUsQ0FBRSxHQUFHLEtBQUssQ0FBRSxDQUFDLENBQUUsQ0FDbEQsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1BcnJheSwgRm9ybUNvbnRyb2wgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB0eXBlIHsgVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIEFzeW5jVmFsaWRhdG9yRm4sIEFic3RyYWN0Q29udHJvbCB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzXCI7XG5cbnR5cGUgQXJyYXlFbGVtZW50PFQ+ID0gVCBleHRlbmRzIEFycmF5PGluZmVyIFU+ID8gVSA6IG5ldmVyO1xuXG50eXBlIFNjYW5Gb3JtVHlwZTxUPiA9IFQgZXh0ZW5kcyBGb3JtR3JvdXA8aW5mZXIgVT4gP1xuICBTY2FuRm9ybVR5cGU8VT4gOlxuICBUIGV4dGVuZHMgRm9ybUFycmF5PGluZmVyIFU+ID9cbiAgU2NhbkZvcm1UeXBlPFU+IDpcbiAgVCBleHRlbmRzIEZvcm1Db250cm9sPGluZmVyIFU+ID9cbiAgU2NhbkZvcm1UeXBlPFU+IDpcbiAgVCBleHRlbmRzIEFycmF5PGluZmVyIFU+ID9cbiAgRm9ybUFycmF5PFNjYW5Gb3JtVHlwZTxVPj4gOlxuICBUIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHN5bWJvbCB8IG51bGwgfCB1bmRlZmluZWQgP1xuICBGb3JtQ29udHJvbDxUIHwgbnVsbD4gOiBGb3JtR3JvdXA8eyBbIEsgaW4ga2V5b2YgVCBdOiBTY2FuRm9ybVR5cGU8VFsgSyBdPjsgfT47XG5cbnR5cGUgRm9ybUdyb3VwVHlwZTxUPiA9IEZvcm1Hcm91cDx7IFsgSyBpbiBrZXlvZiBUIF06IFNjYW5Gb3JtVHlwZTxUWyBLIF0+OyB9PjtcblxudHlwZSBJbm5lclR5cGU8VCwgSyBleHRlbmRzIGtleW9mIFQ+ID0gVFsgSyBdO1xuXG5mdW5jdGlvbiBnZXRWYWxpZGF0b3JzT3JOdWxsPFQgZXh0ZW5kcyBWYWxpZGF0b3JGbltdIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbD4oXG4gIGtleTogc3RyaW5nLCBrZXlzVmFsaWRhdG9yPzogTWFwPHN0cmluZywgVD4sIGFkZExpZnQ6IGJvb2xlYW4gPSBmYWxzZVxuKTogVCB8IHVuZGVmaW5lZCB8IG51bGwge1xuICBjb25zdCByZXN1bHQgPSBrZXlzVmFsaWRhdG9yICYmIGtleXNWYWxpZGF0b3IuaGFzKGtleSkgPyBrZXlzVmFsaWRhdG9yLmdldChrZXkpIDogbnVsbDtcbiAgaWYgKGFkZExpZnQpIHtcbiAgICBpZiAocmVzdWx0ICYmIEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgKDxWYWxpZGF0b3JGbltdPiByZXN1bHQpLnB1c2goPFZhbGlkYXRvckZuPiBsaWZ0RXJyb3JzKTtcbiAgICAgIHJldHVybiA8VD4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0IDogPFQ+WyBsaWZ0RXJyb3JzIF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VGb3JtR3JvdXA8VD4oXG4gIHNvdXJjZTogVCxcbiAgaW50ZXJuYWxLZXk6IHN0cmluZyxcbiAga2V5c1ZhbGlkYXRvcj86IE1hcDxzdHJpbmcsIFZhbGlkYXRvckZuW10gfCBudWxsPixcbiAgYXN5bmNLZXlzVmFsaWRhdG9yPzogTWFwPHN0cmluZywgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbD5cbik6IEZvcm1Hcm91cFR5cGU8VD4ge1xuICByZXR1cm4gc291cmNlIGluc3RhbmNlb2YgRm9ybUdyb3VwPHsgWyBLIGluIGtleW9mIFQgXTogU2NhbkZvcm1UeXBlPFRbIEsgXT47IH0+ID9cbiAgICBzb3VyY2UgOlxuICAgICg8WyBzdHJpbmcgJiBrZXlvZiBULCBJbm5lclR5cGU8VCwgc3RyaW5nICYga2V5b2YgVD4gXVtdPiBPYmplY3QuZW50cmllcyhzb3VyY2UpKS5yZWR1Y2UoXG4gICAgICAoYWNjdW11bGF0b3I6IEZvcm1Hcm91cCwgZW50cnk6IFsgc3RyaW5nICYga2V5b2YgVCwgSW5uZXJUeXBlPFQsIHN0cmluZyAmIGtleW9mIFQ+IF0pID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gZW50cnlbIDAgXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBlbnRyeVsgMSBdO1xuICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpKSB7XG4gICAgICAgICAgYWNjdW11bGF0b3IuYWRkQ29udHJvbChcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICEhdmFsdWUgJiYgKFxuICAgICAgICAgICAgICB2YWx1ZSBpbnN0YW5jZW9mIEZvcm1Hcm91cCB8fCB2YWx1ZSBpbnN0YW5jZW9mIEZvcm1BcnJheSB8fCB2YWx1ZSBpbnN0YW5jZW9mIEZvcm1Db250cm9sPElubmVyVHlwZTxULCBzdHJpbmcgJiBrZXlvZiBUPiB8IG51bGw+XG4gICAgICAgICAgICApID9cbiAgICAgICAgICAgICAgPFNjYW5Gb3JtVHlwZTxJbm5lclR5cGU8VCwgc3RyaW5nICYga2V5b2YgVD4+PiA8dW5rbm93bj4gdmFsdWUgOlxuICAgICAgICAgICAgICBtYWtlRm9ybTxJbm5lclR5cGU8VCwgc3RyaW5nICYga2V5b2YgVD4+KFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIG1ha2VOZXdNYWluRm9ybVZhbGlkYXRvcnNNYXAoa2V5LCBrZXlzVmFsaWRhdG9yKSxcbiAgICAgICAgICAgICAgICBtYWtlTmV3TWFpbkZvcm1WYWxpZGF0b3JzTWFwKGtleSwgYXN5bmNLZXlzVmFsaWRhdG9yKSxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiA8Rm9ybUdyb3VwVHlwZTxUPj4gYWNjdW11bGF0b3I7XG4gICAgICB9LCBuZXcgRm9ybUdyb3VwPHsgWyBLIGluIGtleW9mIFQgXTogU2NhbkZvcm1UeXBlPFRbIEsgXT47IH0+KDx7IFsgSyBpbiBrZXlvZiBUIF06IFNjYW5Gb3JtVHlwZTxUWyBLIF0+OyB9PiB7fSxcbiAgICAgICAgZ2V0VmFsaWRhdG9yc09yTnVsbChpbnRlcm5hbEtleSwga2V5c1ZhbGlkYXRvciwgdHJ1ZSksXG4gICAgICAgIGdldFZhbGlkYXRvcnNPck51bGwoaW50ZXJuYWxLZXksIGFzeW5jS2V5c1ZhbGlkYXRvciwgZmFsc2UpXG4gICAgICApXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gbWFrZU5ld01haW5Gb3JtVmFsaWRhdG9yc01hcDxUIGV4dGVuZHMgVmFsaWRhdG9yRm5bXSB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGw+KFxuICBrZXk6IHN0cmluZywgb2xkTWFwPzogTWFwPHN0cmluZywgVD4sXG4pOiBNYXA8c3RyaW5nLCBUPiB8IHVuZGVmaW5lZCB7XG4gIGlmICghb2xkTWFwIHx8IGtleSA9PT0gJ21haW5Gb3JtVmFsaWRhdG9ycycgfHwga2V5ID09PSAnbWFpbkZvcm1WYWxpZGF0b3JzSXRlbXMnKSB7XG4gICAgcmV0dXJuIG9sZE1hcDtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIW9sZE1hcC5oYXMoa2V5KSAmJiAhb2xkTWFwLmhhcyhgJHsga2V5IH1JdGVtc2ApKSB7XG4gICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFQ+KFxuICAgICAgICBBcnJheS5mcm9tKFxuICAgICAgICAgIG9sZE1hcC5lbnRyaWVzKClcbiAgICAgICAgKS5maWx0ZXIoXG4gICAgICAgICAgaXRlbSA9PiBpdGVtWyAwIF0gIT09ICdtYWluRm9ybVZhbGlkYXRvcnMnICYmIGl0ZW1bIDAgXSAhPT0gJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJ1xuICAgICAgICApLm1hcChcbiAgICAgICAgICAoWyBlbnRyeUtleSwgZW50cnlWYWx1ZSBdKSA9PiBbIGVudHJ5S2V5LnN0YXJ0c1dpdGgoYCR7IGtleSB9LmApID8gZW50cnlLZXkucmVwbGFjZShgJHsga2V5IH0uYCwgJycpIDogZW50cnlLZXksIGVudHJ5VmFsdWUgXVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaWx0ZXJQcmVkaWNhdGUgPSBvbGRNYXAuaGFzKCdtYWluRm9ybVZhbGlkYXRvcnMnKSA/XG4gICAgICAgIG9sZE1hcC5oYXMoJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJykgP1xuICAgICAgICAgIChpdGVtOiBbIHN0cmluZywgVCBdKSA9PiBpdGVtWyAwIF0gIT09IGtleSAmJiBpdGVtWyAwIF0gIT09ICdtYWluRm9ybVZhbGlkYXRvcnMnICYmIGl0ZW1bIDAgXSAhPT0gJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJyA6XG4gICAgICAgICAgKGl0ZW06IFsgc3RyaW5nLCBUIF0pID0+IGl0ZW1bIDAgXSAhPT0ga2V5ICYmIGl0ZW1bIDAgXSAhPT0gJ21haW5Gb3JtVmFsaWRhdG9ycycgOlxuICAgICAgICBvbGRNYXAuaGFzKCdtYWluRm9ybVZhbGlkYXRvcnNJdGVtcycpID9cbiAgICAgICAgICAoaXRlbTogWyBzdHJpbmcsIFQgXSkgPT4gaXRlbVsgMCBdICE9PSBrZXkgJiYgaXRlbVsgMCBdICE9PSAnbWFpbkZvcm1WYWxpZGF0b3JzSXRlbXMnIDpcbiAgICAgICAgICAoaXRlbTogWyBzdHJpbmcsIFQgXSkgPT4gaXRlbVsgMCBdICE9PSBrZXk7XG4gICAgICBjb25zdCBuZXdNYWluVmFsaWRhdG9yc0FycmF5OiBbIHN0cmluZywgVCBdW10gPSBvbGRNYXAuaGFzKGtleSkgP1xuICAgICAgICBvbGRNYXAuaGFzKGAkeyBrZXkgfUl0ZW1zYCkgP1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFsgJ21haW5Gb3JtVmFsaWRhdG9ycycsIG9sZE1hcC5nZXQoa2V5KSEgXSxcbiAgICAgICAgICAgIFsgJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJywgb2xkTWFwLmdldChgJHsga2V5IH1JdGVtc2ApISBdXG4gICAgICAgICAgXSA6XG4gICAgICAgICAgW1xuICAgICAgICAgICAgWyAnbWFpbkZvcm1WYWxpZGF0b3JzJywgb2xkTWFwLmdldChrZXkpISBdLFxuICAgICAgICAgIF0gOlxuICAgICAgICBvbGRNYXAuaGFzKGAkeyBrZXkgfUl0ZW1zYCkgP1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFsgJ21haW5Gb3JtVmFsaWRhdG9yc0l0ZW1zJywgb2xkTWFwLmdldChgJHsga2V5IH1JdGVtc2ApISBdXG4gICAgICAgICAgXSA6XG4gICAgICAgICAgW107XG4gICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFQ+KFtcbiAgICAgICAgLi4ubmV3TWFpblZhbGlkYXRvcnNBcnJheSxcbiAgICAgICAgLi4uQXJyYXkuZnJvbShcbiAgICAgICAgICBvbGRNYXAuZW50cmllcygpXG4gICAgICAgICkuZmlsdGVyKGZpbHRlclByZWRpY2F0ZSkubWFwPFsgc3RyaW5nLCBUIF0+KFxuICAgICAgICAgIChbIGVudHJ5S2V5LCBlbnRyeVZhbHVlIF0pID0+IFsgZW50cnlLZXkuc3RhcnRzV2l0aChgJHsga2V5IH0uYCkgPyBlbnRyeUtleS5yZXBsYWNlKGAkeyBrZXkgfS5gLCAnJykgOiBlbnRyeUtleSwgZW50cnlWYWx1ZSBdXG4gICAgICAgIClcbiAgICAgIF0pO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlRm9ybTxUPihcbiAgc291cmNlOiBULFxuICBrZXlzVmFsaWRhdG9yPzogTWFwPHN0cmluZywgVmFsaWRhdG9yRm5bXSB8IG51bGw+LFxuICBhc3luY0tleXNWYWxpZGF0b3I/OiBNYXA8c3RyaW5nLCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsPixcbik6IFNjYW5Gb3JtVHlwZTxUPiB7XG4gIGNvbnN0IGZvcm0gPSAhIXNvdXJjZSAmJiAodHlwZW9mIHNvdXJjZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgIHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5PEFycmF5RWxlbWVudDxUPj4gP1xuICAgICAgbmV3IEZvcm1BcnJheShcbiAgICAgICAgc291cmNlLm1hcChcbiAgICAgICAgICAoaXRlbTogQXJyYXlFbGVtZW50PFQ+KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtRm9ybSA9IG1ha2VGb3JtKFxuICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICBtYWtlTmV3TWFpbkZvcm1WYWxpZGF0b3JzTWFwKCdtYWluRm9ybVZhbGlkYXRvcnNJdGVtcycsIGtleXNWYWxpZGF0b3IpLFxuICAgICAgICAgICAgICBtYWtlTmV3TWFpbkZvcm1WYWxpZGF0b3JzTWFwKCdtYWluRm9ybVZhbGlkYXRvcnNJdGVtcycsIGFzeW5jS2V5c1ZhbGlkYXRvcilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbUZvcm07XG4gICAgICAgICAgfSksXG4gICAgICAgIGdldFZhbGlkYXRvcnNPck51bGwoJ21haW5Gb3JtVmFsaWRhdG9ycycsIGtleXNWYWxpZGF0b3IsIHRydWUpLFxuICAgICAgICBnZXRWYWxpZGF0b3JzT3JOdWxsKCdtYWluRm9ybVZhbGlkYXRvcnMnLCBhc3luY0tleXNWYWxpZGF0b3IsIGZhbHNlKVxuICAgICAgKSA6XG4gICAgICBtYWtlRm9ybUdyb3VwPFQ+KHNvdXJjZSwgJ21haW5Gb3JtVmFsaWRhdG9ycycsIGtleXNWYWxpZGF0b3IsIGFzeW5jS2V5c1ZhbGlkYXRvcikgOlxuICAgIG5ldyBGb3JtQ29udHJvbDxUIHwgbnVsbD4oXG4gICAgICAhIXNvdXJjZSAmJiB0eXBlb2Ygc291cmNlID09ICdzdHJpbmcnICYmIChzb3VyY2UuaW5jbHVkZXMoJzAwMDEtMDEtMDEnKSB8fCBzb3VyY2UuaW5jbHVkZXMoJzE5NzAtMDEtMDEnKSkgPyBudWxsIDogc291cmNlXG4gICAgICAsXG4gICAgICBnZXRWYWxpZGF0b3JzT3JOdWxsKCdtYWluRm9ybVZhbGlkYXRvcnMnLCBrZXlzVmFsaWRhdG9yLCBmYWxzZSksXG4gICAgICBnZXRWYWxpZGF0b3JzT3JOdWxsKCdtYWluRm9ybVZhbGlkYXRvcnMnLCBhc3luY0tleXNWYWxpZGF0b3IsIGZhbHNlKVxuICAgICk7XG4gIHJldHVybiA8U2NhbkZvcm1UeXBlPFQ+PiBmb3JtO1xufTtcblxuZnVuY3Rpb24gbGlmdEVycm9ycyhjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gIGlmIChjb250cm9sIGluc3RhbmNlb2YgRm9ybUNvbnRyb2wpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhbGxDb250cm9scyA9IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtR3JvdXAgP1xuICAgICAgT2JqZWN0LnZhbHVlcyhjb250cm9sLmNvbnRyb2xzKSA6XG4gICAgICBjb250cm9sIGluc3RhbmNlb2YgRm9ybUFycmF5ID9cbiAgICAgICAgY29udHJvbC5jb250cm9scyA6XG4gICAgICAgIFtdO1xuICAgIGNvbnN0IGludmFsaWRDb250cm9scyA9IGFsbENvbnRyb2xzLmZpbHRlcihjb250cm9sID0+IGNvbnRyb2wuc3RhdHVzID09PSAnSU5WQUxJRCcpO1xuICAgIHJldHVybiBpbnZhbGlkQ29udHJvbHMubGVuZ3RoID09PSAwID8gbnVsbCA6IGludmFsaWRDb250cm9scy5yZWR1Y2UoXG4gICAgICAoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnQuZXJyb3JzKSB7XG4gICAgICAgICAgYWRkVmFsaWRhdGlvbkVycm9ycyhjdXJyZW50LmVycm9ycywgYWNjdW11bGF0b3IpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICB9LCA8VmFsaWRhdGlvbkVycm9ycz4ge31cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaWZ0VmFsaWRhdGlvbkVycm9ycyhjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gIGNvbnN0IGFsbENvbnRyb2xzID0gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Hcm91cCA/XG4gICAgT2JqZWN0LnZhbHVlcyhjb250cm9sLmNvbnRyb2xzKSA6XG4gICAgY29udHJvbCBpbnN0YW5jZW9mIEZvcm1BcnJheSA/XG4gICAgICBjb250cm9sLmNvbnRyb2xzIDpcbiAgICAgIFtdO1xuICBjb25zdCBpbnZhbGlkQ29udHJvbHMgPSBhbGxDb250cm9scy5maWx0ZXIoY29udHJvbCA9PiBjb250cm9sLnN0YXR1cyA9PT0gJ0lOVkFMSUQnKTtcbiAgY29uc3QgZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzID0gaW52YWxpZENvbnRyb2xzLmxlbmd0aCA9PT0gMCA/IHt9IDogaW52YWxpZENvbnRyb2xzLnJlZHVjZShcbiAgICAoYWNjdW11bGF0b3IsIGN1cnJlbnQpID0+IHtcbiAgICAgIGlmIChjdXJyZW50LmVycm9ycykge1xuICAgICAgICBhZGRWYWxpZGF0aW9uRXJyb3JzKGN1cnJlbnQuZXJyb3JzLCBhY2N1bXVsYXRvcik7XG4gICAgICB9O1xuICAgICAgY29uc3QgaW5uZXJFcnJvcnMgPSBsaWZ0VmFsaWRhdGlvbkVycm9ycyhjdXJyZW50KTtcbiAgICAgIGlmIChpbm5lckVycm9ycykge1xuICAgICAgICBhZGRWYWxpZGF0aW9uRXJyb3JzKGlubmVyRXJyb3JzLCBhY2N1bXVsYXRvcik7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgIH0sIDxWYWxpZGF0aW9uRXJyb3JzPiB7fVxuICApO1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhlcnJvcnMpLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBlcnJvcnM7XG59O1xuXG5mdW5jdGlvbiBhZGRWYWxpZGF0aW9uRXJyb3JzKGFkZGl0aW9uRXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzLCBjdXJyZW50RXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzKSB7XG4gIE9iamVjdC5lbnRyaWVzKGFkZGl0aW9uRXJyb3JzKS5mb3JFYWNoKFxuICAgIGVudHJ5ID0+IGN1cnJlbnRFcnJvcnNbIGVudHJ5WyAwIF0gXSA9IGVudHJ5WyAxIF1cbiAgKTtcbn0iXX0=