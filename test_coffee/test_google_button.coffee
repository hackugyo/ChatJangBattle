assert = require 'assert'
zombie = require 'zombie'

describe 'Web', ->
    describe '/', ->
        host = 'http://localhost:5000'
        browser = null
        window = null
        $ = null

        before (done) ->
            zombie.visit host, (e, br, status)->
                browser = br
                window = browser.window
                $ = window.$
                window.onload()
                done()

        it 'title is Google', (done) ->
            assert.equal $('title').text, 'Google'