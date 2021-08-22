import * as mapping from "./mapping"
// @ponicode
describe("mapping.handleSetPurpose", () => {
    test("0", () => {
        let callFunction: any = () => {
            mapping.handleSetPurpose(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
