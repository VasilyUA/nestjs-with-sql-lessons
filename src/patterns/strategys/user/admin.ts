class AdminStrategy {
  private req = {};

  constructor(req) {
    this.req = req;
    console.warn('call AdminStrategy'); // eslint-disable-line no-console
  }

  public getRequest() {
    return 'getRequest';
  }
}

export const Strategy = AdminStrategy;
