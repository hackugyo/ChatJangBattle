
app     = require '../app'
browser = require('tobi').createBrowser 5000, 'localhost'

describe 'web', ->
    describe '/', ->
        it 'titleがJANG Battle!! TOPであること', (done) ->
          browser.get '/', (res, $) ->
            res.should.have.status 200
            res.should.have.header(
                'Content-Type', 'text/html; charset=utf-8'
            )
            $('title').text().should.equal('JANG Battle!! TOP')
            done()
            return
          return

        it '後で書きます'
        return
      return
    return
