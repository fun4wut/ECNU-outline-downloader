import strEnc from '../src/des'

test('des encode ECNU',()=>{
    expect(strEnc("ECNU","1","2","3")).toBe("B9EE0138CC2A3F7C")
})