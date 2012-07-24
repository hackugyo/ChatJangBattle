var app = require('../app');
var browser = require('tobi').createBrowser(5000, 'localhost');

describe('web', function() {
  describe('/', function() {
    it('titleがJANG Battle!! TOPであること', function(done) {
      browser.get('/', function(res, $) {
        res.should.have.status(200);
        res.should.have.header(
          'Content-Type', 'text/html; charset=utf-8'
        );
        $('title').text().should.equal('JANG Battle!! TOP');
        done();
      });
    });
    it('後で書くよ');
  });
});
        