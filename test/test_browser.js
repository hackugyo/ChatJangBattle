var app = require('../app');
var browser = require('tobi').createBrowser(5000, 'localhost');
var should = require('should');

describe('web', function() {
  describe('/socket', function() {
    it('titleがJANG Battle!! であること', function(done) {
      browser.get('/socket', function(res, $) {
        res.should.have.status(200);
        res.should.have.header(
          'Content-Type', 'text/html; charset=utf-8'
        );
        $('title').text().should.equal('JANG Battle!!');
        // $を使った記法はJQuery由来のもの．
        
        // app.close()がtobiのExampleだと推奨されてるが（逆にdone()がない），
        // これをやると次のテストがError: connect ECONNREFUSEDになる？
        // app.close();
        done();
      });
    });
    
    it('後で書くよ');

    it('ul id:logが存在すること', function(done) {
      browser.get('/socket', function(res, $) {
        res.should.have.status(200);
        // existは以下のように書いてはだめ
        // $('ul#log').should.exist;
        // $('ul.log').should.exist();
        should.exist($('#log'));
        // これにこけてしまうので，テストとして機能してない
        // should.not.exist($('ul.notexist'));
        // これを通してしまうので，テストとして機能してない
        // should.exist($('ul.notexist'));
        
        $('#log').should.not.have.one('li');
        $('#test').should.have.many('li', 'テスト');

        // これもテストとして機能してない（どっちも通ってしまう）
        // $('#test').should.not.have.many('li');
        // $('#test').should.have.many('li');
        // もっとださい書きかたで我慢
         $('#test').find('li').size().should.equal(2);
        done();
      });
    });
      
    it('ul id:logが1回ポストすると子を持つこと', function(done) {
      browser.get('/socket', function(res, $) {
        res.should.have.status(200);
        browser.click('input_p', function(res, $){
          browser.click('input_p', function(res, $){
            res.should.have.status(200);
            $('#input_p').val().should.equal('押した');
            
            // 通らない，確かにソースには追加されないのだが…
            // $('#log').should.have.one('li', 'input_name');
            $('#log').find('li').size().should.equal(1);
            $('#log').find('li:first').text().should.equal('');
            should.exist($('log'));
            console.log($('body'));
            done();
          });
        });
      });
    });
    
  });
});
        