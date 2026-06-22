import { StorePage } from './storePage';

class LoginPage extends StorePage {
  get username() {
    return $('[data-test="username"]');
  }
  get password() {
    return $('[data-test="password"]');
  }
  get loginBtn() {
    return $('[data-test="login-button"]');
  }
  get loginErrorMsg() {
    return $('[data-test="login-error-message"]');
  }

  async open() {
    await super.open('login');
  }

  async clickLogin() {
    await this.loginBtn.click();
  }

  async getLoginErrorMsg() {
    return this.loginErrorMsg.getText();
  }

  async login(username: string, password: string) {
    await this.username.setValue(username);
    await this.password.setValue(password);
    await this.clickLogin();
  }
}

export default new LoginPage();

