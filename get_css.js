//casperオブジェクトを生成
var casper = require('casper').create();
casper.userAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53");
var fs = require("fs");

//ファイル入出力用のオブジェクトを生成
//targetUrlに対象URLを入れる
var targetUrl = "";
var styleJson;
var styleCss = "";
//指定のURLへ遷移する
casper.start();

casper.open(targetUrl);

//対象サイトのスタイルを解析しcssをJSON形式にoutputする
casper.then(function(){
    styleJson = this.evaluate(function(){
      try{
        var outputJson = {};
        var targetProperty = ["background", "background-color", "border-color", "border-style", "border", "padding", "margin", "color", "font-family"];
        var elements = document.getElementsByTagName('*');
        //var elements = document.querySelectorAll('body *');
        for(var i=0;i<elements.length;i++) {
          var css = window.getComputedStyle(elements[i]);
          
          if(outputJson[elements[i].tagName.toLowerCase()] !== undefined){
            continue;
          }
          outputJson[elements[i].tagName.toLowerCase()] = {};
          for(var j=0; j< targetProperty.length;j++) {
            outputJson[elements[i].tagName.toLowerCase()][targetProperty[j]] = css.getPropertyValue([targetProperty[j]]) + ";";
          }
        }
      }catch(e){
        return e.toString();
      }
        return JSON.stringify(outputJson);
    });
});

//解析したJSONを受け取りcssファイルとしてoutputする
casper.then(function(){
  target = JSON.parse(styleJson);
  for(index in target) {  
    styleCss += index + "{";
    for(index2 in target[index]) {
      styleCss += index2 + ":" + target[index][index2];
    }
    styleCss += "}";
  }
    fs.write('/Users/USERNAME/Desktop/style_lp.css', styleCss, 'w');
});

//処理の実行
casper.run();