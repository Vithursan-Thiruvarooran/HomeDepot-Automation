class StorePage {
  async open() {
    await browser.url("https://automation-interview.vercel.app/");
  }
}

export default new StorePage();
