var app = require('../app');
// var browser = require('tobi').createBrowser(5000, 'localhost');
var browser = require('tobi').createBrowser(80, 'jangbattle.herokuapp.com');
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

        // one(), many()が使えなくなった……
        // $('#log').should.not.have.one('li');
        // $('#test').should.have.many('li', 'テスト');

        // これもテストとして機能してない（どっちも通ってしまう）
        // $('#test').should.not.have.many('li');
        // $('#test').should.have.many('li');
        // もっとださい書きかたで我慢
        $('#test').find('li').size().should.equal(2);
        $('#log').find('li').size().should.equal(0);
        done();
      });
    });

    it('1回パーのボタンを押すとボタンのvalueが「押した」に変わること', function(done) {
      browser.get('/socket', function(res, $) {
        res.should.have.status(200);

        $('form#form_p').find('input#input_p').val().should.equal('ぱー');
        $('form#form_p').find('input#input_p').val().should.not.equal('押した');
        $('form#form_c').find('input#input_c').val().should.equal('ちょき');
        $('form#form_g').find('input#input_g').val().should.equal('ぐー');

        $('form#form_p').find('input').size().should.equal(1);
        
        $('#input_p').val().should.equal('ぱー');
        browser.submit($('#form_p'), function(res, $){
        //browser.click($('form#form_p :input#input_p'), function(res, $){
          res.should.have.status(200);

          // 押したのでボタンが変わること
          $('input#input_p').val().should.equal('押した');
          done();
        });
      });
    });
    
    it('ul id:logが1回ポストすると子を持つこと', function(done) {
      browser.get('/socket', function(res, $) {
        res.should.have.status(200);
        browser.click('#input_p', function(res, $){
          res.should.have.status(200);
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
        