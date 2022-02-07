// 기본적인 test 방식

describe('Calculation', () => {
  test('2더4하기2는4', () => {
    expect(2 + 2).toBe(4);
  });

  test('2더4하기2는5가 아님', () => {
    expect(2 + 2).not.toBe(5);
  });
});
