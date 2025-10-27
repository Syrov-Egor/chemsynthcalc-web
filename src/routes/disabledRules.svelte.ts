export type AppMode = 'formula' | 'balance' | 'masses';

export type ComponentName = 
  | 'Algorithm'
  | 'RunMode' 
  | 'TargetNumber'
  | 'TargetMass'
  | 'Intify'
  | 'OutputPrecision'
  | 'FloatTolerance'
  | 'MaxCombinations';

export const getDisabledState = (component: ComponentName, mode: AppMode): boolean => {
    const rules: Record<ComponentName, boolean> = {
        'Algorithm': mode === 'formula' || mode === 'masses',
        'RunMode': mode === 'formula' || mode === 'balance',
        'TargetNumber': mode === 'formula' || mode === 'balance',
        'TargetMass': mode === 'formula' || mode === 'balance',
        'Intify': mode === 'formula',
        'OutputPrecision': mode === 'balance',
        'FloatTolerance': mode === 'formula',
        'MaxCombinations': mode === 'formula' || mode === 'masses',
    };
    
    return rules[component];
};