
app     = require '../app'
browser = require('tobi').createBrowser 5050, 'localhost'

describe 'web', ->
    describe '/', ->
        it 'titleがJANG Battle!!であること', (done) ->
          browser.get '/socket', (res, $) ->
            res.should.have.status 200
            res.should.have.header(
                'Content-Type', 'text/html; charset=utf-8'
            )
            $('title').text().should.equal('JANG Battle!!')
            app.close()
            done()
            return
          return

        it '後で書きます'
        return
      return
    return
