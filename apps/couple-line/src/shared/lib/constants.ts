export const ACCOUNT_TYPES = ['자산', '부채'] as const
export const CATEGORY_TYPES = ['수입', '지출'] as const
export const TRANSACTION_TYPES = ['수입', '지출', '이체'] as const
export const USER_ROLES = ['OWNER', 'MANAGER', 'MEMBER'] as const
export const ACCOUNT_OWNERS = ['형민', '희재', '공용'] as const
export const ACCOUNT_SUB_TYPES = [
  '입출금',
  '예적금',
  '투자',
  '연금',
  '보증금',
  '신용카드',
  '페이/포인트',
  '현금',
  '기타',
] as const
export const ASSET_GROUPS = [
  '안정 자산',
  '유동 자산',
  '투자 자산',
  '실물 자산',
  '미분류 자산',
] as const
export const SPACE_NAV_ITEMS = [
  { label: '대시보드', to: '/$spaceId', exact: true },
  { label: '거래내역', to: '/$spaceId/transactions' },
  { label: '카테고리', to: '/$spaceId/categories' },
  { label: '계정', to: '/$spaceId/accounts' },
  { label: '사용자 관리', to: '/$spaceId/members' },
] as const

export const ROLE_LABEL: Record<(typeof USER_ROLES)[number], string> = {
  OWNER: '오너',
  MANAGER: '매니저',
  MEMBER: '멤버',
}
