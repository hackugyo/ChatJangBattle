browser = require('tobi').createBrowser 80, 'jangbattle.herokuapp.com'
should = require 'should'
describe 'web', ->
    describe '/socket', ->
        it 'titleがJANG Battle!! であること', (done)->
            browser.get '/socket', (res, $) ->
                res.should.have.status 200
                res.should.have.header 'Content-Type', 'text/html; charset=utf-8'
                # $を使った記法はJQuery由来のもの．
                $('title').text().should.equal 'JANG Battle!!'
                done()
        it 'ul logが存在すること', (done) ->
            browser.get '/socket', (res, $) ->
                res.should.have.status 200
                should.exist $('#log')
                $('#log').find('li').size().should.equal 0
                $('#test').find('li').size().should.equal 2
                done()

        it '1回ポストするとul logが子を持つこと', (done)->
            this.timeout(6000);

            browser.get '/socket', (res, $) ->
                res.should.have.status 200
                browser.click '#input_p', (res, $) ->
                    res.should.have.status 200
                    setTimeout (->
                        $('#log').find('li').size().should.equal 1
                        done()
                        ), 3000