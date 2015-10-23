import { loginPresenter } from '../../src/js/login/login_presenter.js';

describe('LoginPresenter', () => {
  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should mount login is session is undefined', () => {
    localStorage.removeItem("user");
    var riotSpy = sandbox.spy(riot, "mount");
    loginPresenter();
    expect(riotSpy.calledOnce).to.be.true;
  });

  it('should not mount login is session is present', () => {
    localStorage.setItem("user", "username");
    var riotSpy = sandbox.spy(riot, "mount");
    loginPresenter();
    expect(riotSpy.called).to.be.false;
  });
});