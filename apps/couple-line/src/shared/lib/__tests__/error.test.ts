import { describe, it, expect } from 'vitest'
import { getErrorMessage } from '#/shared/lib/error'

describe('getErrorMessage', () => {
  it('normalizes RLS errors', () => {
    const result = getErrorMessage('new row violates row-level security policy')
    expect(result).toBe('이 공간을 수정할 권한이 없어요.')
  })

  it('normalizes foreign key errors', () => {
    const result = getErrorMessage(
      'update or delete on table violates foreign key constraint',
    )
    expect(result).toBe(
      '연결된 거래나 데이터가 있어 지금은 처리할 수 없어요.',
    )
  })

  it('normalizes duplicate key errors', () => {
    const result = getErrorMessage('duplicate key value violates unique constraint')
    expect(result).toBe(
      '이미 같은 값이 있어요. 이름이나 설정을 다시 확인해 주세요.',
    )
  })

  it('normalizes check constraint errors', () => {
    const result = getErrorMessage(
      'new row violates check constraint "check_transaction_logic"',
    )
    expect(result).toBe(
      '입력한 값 조합이 CoupleLine 장부 규칙과 맞지 않아요.',
    )
  })

  it('normalizes network errors', () => {
    expect(getErrorMessage('Failed to fetch')).toBe(
      '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
    )
    expect(getErrorMessage('network error')).toBe(
      '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
    )
  })

  it('extracts message from Error objects', () => {
    const result = getErrorMessage(new Error('row-level security'))
    expect(result).toBe('이 공간을 수정할 권한이 없어요.')
  })

  it('extracts message from plain objects', () => {
    const result = getErrorMessage({ message: 'something went wrong' })
    expect(result).toBe('something went wrong')
  })

  it('tries error_description, details, hint keys', () => {
    expect(getErrorMessage({ error_description: 'desc' })).toBe('desc')
    expect(getErrorMessage({ details: 'detail info' })).toBe('detail info')
    expect(getErrorMessage({ hint: 'a hint' })).toBe('a hint')
  })

  it('resolves Postgres error codes from Supabase objects', () => {
    expect(getErrorMessage({ code: '23503', message: 'FK violation' })).toBe(
      '연결된 거래나 데이터가 있어 지금은 처리할 수 없어요.',
    )
    expect(getErrorMessage({ code: '23505', message: 'unique' })).toBe(
      '이미 같은 값이 있어요. 이름이나 설정을 다시 확인해 주세요.',
    )
    expect(getErrorMessage({ code: '42501', message: 'permission denied' })).toBe(
      '이 공간을 수정할 권한이 없어요.',
    )
    expect(getErrorMessage({ code: 'PGRST301', message: 'jwt expired' })).toBe(
      '로그인이 만료되었어요. 다시 로그인해 주세요.',
    )
  })

  it('normalizes JWT expired errors', () => {
    expect(getErrorMessage('JWT expired')).toBe(
      '로그인이 만료되었어요. 다시 로그인해 주세요.',
    )
  })

  it('normalizes timeout errors', () => {
    expect(getErrorMessage('request timed out')).toBe(
      '서버 응답이 너무 느려요. 잠시 후 다시 시도해 주세요.',
    )
  })

  it('returns fallback for unrecognized errors', () => {
    expect(getErrorMessage(null)).toBe('잠시 후 다시 시도해 주세요.')
    expect(getErrorMessage(42)).toBe('잠시 후 다시 시도해 주세요.')
    expect(getErrorMessage(undefined, '커스텀 폴백')).toBe('커스텀 폴백')
  })
})
