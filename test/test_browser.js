var app = require('../app');
var browser = require('tobi').createBrowser(5000, 'localhost');
var should = require('should');

describe('web', function() {
  describe('/', function() {
    it('titleがJANG Battle!! TOPであること', function(done) {
      browser.get('/', function(res, $) {
        res.should.have.status(200);
        res.should.have.header(
          'Content-Type', 'text/html; charset=utf-8'
        );
        $('title').text().should.equal('JANG Battle!! TOP');
        // $を使った記法はJQuery由来のもの．
        
        // app.close()がtobiのExampleだと推奨されてるが（逆にdone()がない），
        // これをやると次のテストがError: connect ECONNREFUSEDになる？
        // app.close();
        done();
      });
    });
    
    it('後で書くよ');

    it('ul id:logが存在すること', function(done) {
      browser.get('/', function(res, $) {
        res.should.have.status(200);
        // テストとして機能してない
        // $('ul#log').should.exist;
        $('ul#log').should.not.have.many('li');
        $('ul#test').should.have.one('li', 'テスト'); 
        done();
      });
    });
      
    it('ul id:logが1回ポストすると子を持つこと', function(done) {
      browser.get('/', function(res, $) {
        res.should.have.status(200);
        browser.click('hand_p', function(res, $){
          res.should.have.status(200);
          // 通らない，確かにソースには追加されないのだが……
          $('ul#log').should.have.one('li', 'input_name');
          done();
        });
      });
    });
    
  });
});
        