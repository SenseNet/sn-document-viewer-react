import { MapStateToProps } from 'react-redux'
import { RootReducerType } from '../store'

/**
 * Helper type to combine the mapStateToProps and mapDispatchToProps methods and the ownProps types
 * Usage example in a React component definition:
 *
 * ```ts
 * class DocumentViewerLoadingComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, undefined>>{
 *  // class definition
 * }
 * ```
 */
export type componentType<
  TStateToProps extends MapStateToProps<TState, TOwnProps, State>,
  TDispatchToProps,
  TOwnProps = undefined,
  TState = ReturnType<TStateToProps>,
  State = RootReducerType
> = ReturnType<TStateToProps> & TDispatchToProps & TOwnProps

/**
 * Casts an arbitrary value to a number. Both null and undefined are treated as undefined values by default.
 * @param value An arbitrary value to convert to a number.
 * @param defaultValue The default value that is used when the specified value is either null or undefined values.
 * @returns Number | NaN | undefined
 * @example
 *    undefined = asNumber(undefined)
 *    undefined = asNumber(null)
 *    10        = asNumber(10)
 *    10        = asNumber('10')
 *    10        = asNumber({ toString() { return '10'; } })
 *    NaN       = asNumber('Hello')
 * @see https://github.com/winjs/winjs/blob/e0ad943d1cd597b2deeddfdb04ab9462c3ab7ce7/src/js/WinJS/BindingList.js#L38
 */
export function asNumber(value: any, defaultValue?: number): number | undefined {
  const num = value === null || value === undefined || value === '' ? defaultValue : +value
  return num
}
