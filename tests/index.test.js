import chai from 'chai';
import chaitHttp from 'chai-http';
import app from '../index';

const should = chai.should();

chai.use(chaitHttp);

// testing the root rout
describe('Root test', () => {
    it('should pass as the response is json object and with message', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                done();
            });
    });
})