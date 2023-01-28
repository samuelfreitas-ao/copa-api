export class TokenUtils {
  static init() {
    let tokenList = (global as any).tokenList

    if (!tokenList) {
      ;(global as any).tokenList = []
    }
  }

  static block(token: string): void {
    const tokenList: [] = (global as any).tokenList

    let _token = token
    if (token.split(' ').length > 1) {
      _token = token.split(' ')[1]
    }

    if (tokenList.find((item) => item == _token)) {
      return
    }

    ;(global as any).tokenList.push(_token)
  }

  static getAll(): string[] {
    return (global as any).tokenList ?? []
  }
}
