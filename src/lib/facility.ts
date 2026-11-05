export type FacilityTab = 'laundry' | 'meeting'

export const DEFAULT_FACILITY_TAB: FacilityTab = 'laundry'

/** URL 쿼리 값을 시설 탭으로. 알 수 없는 값은 기본 탭으로 둔다 */
export function parseFacilityTab(value: unknown): FacilityTab {
  return value === 'meeting' ? 'meeting' : DEFAULT_FACILITY_TAB
}
