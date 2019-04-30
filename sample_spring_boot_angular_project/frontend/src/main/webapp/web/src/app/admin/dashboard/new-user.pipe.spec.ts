import { NewUserPipe } from './new-user.pipe';

describe('NewUserPipe', () => {
  it('create an instance', () => {
    const pipe = new NewUserPipe();
    expect(pipe).toBeTruthy();
  });
});
