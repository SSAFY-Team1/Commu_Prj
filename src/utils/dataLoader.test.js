import { describe, expect, it } from 'vitest'
import { aggregateByCategory, aggregateByDistrict, extractDistrict, normalizeItem, toChatContext } from './dataLoader'

describe('dataLoader helpers', () => {
  it('원본 TourAPI 항목을 화면용 데이터로 정규화한다', () => {
    const item = normalizeItem(
      {
        contentid: '1',
        contenttypeid: '12',
        title: '광화문광장',
        addr1: '서울특별시 종로구 세종대로',
        tel: '',
        mapx: '126.9768',
        mapy: '37.5704',
        firstimage: ''
      },
      { category: '관광지' }
    )

    expect(item.id).toBe('1')
    expect(item.category).toBe('관광지')
    expect(item.mapx).toBe(126.9768)
    expect(item.mapy).toBe(37.5704)
    expect(item.district).toBe('종로구')
    expect(item.tel).toBe('전화번호 정보 없음')
  })

  it('주소에 자치구가 없으면 미분류를 반환한다', () => {
    expect(extractDistrict('주소 정보 없음')).toBe('미분류')
  })

  it('카테고리와 자치구를 집계한다', () => {
    const items = [
      { category: '관광지', district: '종로구' },
      { category: '관광지', district: '중구' },
      { category: '문화시설', district: '중구' }
    ]

    expect(aggregateByCategory(items)).toEqual({ 관광지: 2, 문화시설: 1 })
    expect(aggregateByDistrict(items)).toEqual({ 종로구: 1, 중구: 2 })
  })

  it('챗봇 context는 필요한 필드와 제한 건수만 포함한다', () => {
    const context = toChatContext(
      [
        { id: '1', title: 'A', category: '관광지', address: 'addr', tel: '02' },
        { id: '2', title: 'B', category: '쇼핑', address: 'addr', tel: '02' }
      ],
      1
    )

    expect(context).toEqual([{ id: '1', title: 'A', name: 'A', category: '관광지', address: 'addr', tel: '02' }])
  })
})
