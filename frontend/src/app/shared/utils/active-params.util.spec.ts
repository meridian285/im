import {ActiveParamsUtil} from "./active-params.util";

describe('active params util', () => {

  it('should return change string to type array', () => {
    const result = ActiveParamsUtil.processParams({
      types: 'sukkulenti'
    });

    expect(result.types).toBeInstanceOf(Array);
  })

  it('should return change string to int', () => {
    const result = ActiveParamsUtil.processParams({
      page: '2'
    });

    expect(result.page).toBe(2);
  });

  it('should return change object', () => {
    const result = ActiveParamsUtil.processParams({
      types: 'sukkulenti',
      heightFrom: '20',
      heightTo: '21',
      diameterFrom: '22',
      diameterTo: '23',
      sort: '1',
      page: '2',
    });

    expect(result).toEqual({
      types: ['sukkulenti'],
      heightFrom: '20',
      heightTo: '21',
      diameterFrom: '22',
      diameterTo: '23',
      sort: '1',
      page: 2,
    })
  });

  it('should return change string to int', () => {
    const result: any = ActiveParamsUtil.processParams({
      pages: '2'
    });

    expect(result.pages).toBeUndefined();
  });

});
