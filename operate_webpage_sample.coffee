casper = require("casper").create()

casper.start "http://jangbattle.herokuapp.com/socket", ->
# casper.start "http://localhost:5000/socket", ->
    @viewport 1024, 768

    # ページタイトル
    @test.assertTitle 'JANG Battle!!', 'タイトルがJANG Battleであること'

casper.then ->
    @test.assertExists 'ul#log', 'ul#logが存在'
    @capture 'casper_capture/before.png'

casper.then ->
    @test.assertExists 'input#name', 'nameが存在'

casper.then ->
    @test.assertExists 'form#form_p', 'form#form_pが存在'
    @test.assertExists 'input#input_p', 'input#input_pが存在'
    @test.assertExists 'input#input_c', 'input#input_cが存在'
    @test.assertNotExists 'input#input_w', 'input#input_wが非存在'

casper.then ->
    @page.injectJs 'scripts/jquery-latest.min.js'
    value = @evaluate ->
        $('input#input_p').val()
    @test.assertEquals value, 'ぱー', '押す前はボタンはぱー'

casper.then ->

    @click 'input#input_p'

    @page.injectJs 'casper_scripts/jquery.min.js'
    value = @evaluate ->
        $('input#input_p').val()
    @evaluate ->
        # ボタンをonclick
    @test.assertEquals value, '押した', '押したらボタンが変化'
    @capture 'casper_capture/after.png'

casper.run ->
    @exit()