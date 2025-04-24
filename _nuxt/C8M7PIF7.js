import{_ as m}from"./AY8pHfWy.js";import{r as g,g as u,o as s,a as i,u as t,i as v,b as k,w as r,d as n,c as h}from"./hT7Su8Cx.js";import{_ as b}from"./FHpZP8EQ.js";import{u as C,S as y,P as $,U as _,E as A}from"./DIyoYlPM.js";import{T as x}from"./B_LEoRis.js";import{V as a}from"./BlfYvl15.js";import{V as E}from"./B7gN4bOp.js";import{V as B,a as f}from"./DZfHqwQX.js";import"./DjybWCsk.js";import"./BWcu_LkA.js";import"./Cu8cl2vz.js";import"./DgdoBwi5.js";import"./BHIiXw9g.js";/* empty css        */const w={__name:"DemoEditorBasicEditor",setup(c){const o=g(`
<p>
  This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That's it. It's probably too much for real minimalists though.
</p>
<p>
  The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.  
</p>
`);return(p,e)=>{const l=m;return s(),u("div",null,[i(l,{modelValue:t(o),"onUpdate:modelValue":e[0]||(e[0]=d=>v(o)?o.value=d:null),class:"border rounded"},null,8,["modelValue"])])}}},V={class:"border pa-2 rounded"},H={key:0,class:"d-flex flex-wrap gap-x-4 gap-y-2 mb-2"},I={__name:"DemoEditorCustomEditor",setup(c){const o=C({content:`
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That's a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that's amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,extensions:[y,x.configure({types:["heading","paragraph"]}),$.configure({placeholder:"Write something here..."}),_]});return(p,e)=>(s(),u("div",V,[t(o)?(s(),u("div",H,[i(a,{disabled:!t(o).can().chain().focus().toggleBold().run(),color:t(o).isActive("bold")?"primary":"",onClick:e[0]||(e[0]=l=>t(o).chain().focus().toggleBold().run())},{default:r(()=>[n(" bold ")]),_:1},8,["disabled","color"]),i(a,{disabled:!t(o).can().chain().focus().toggleItalic().run(),color:t(o).isActive("italic")?"primary":"",onClick:e[1]||(e[1]=l=>t(o).chain().focus().toggleItalic().run())},{default:r(()=>[n(" italic ")]),_:1},8,["disabled","color"]),i(a,{disabled:!t(o).can().chain().focus().toggleStrike().run(),color:t(o).isActive("strike")?"primary":"",onClick:e[2]||(e[2]=l=>t(o).chain().focus().toggleStrike().run())},{default:r(()=>[n(" strike ")]),_:1},8,["disabled","color"]),i(a,{disabled:!t(o).can().chain().focus().toggleCode().run(),color:t(o).isActive("code")?"primary":"",onClick:e[3]||(e[3]=l=>t(o).chain().focus().toggleCode().run())},{default:r(()=>[n(" code ")]),_:1},8,["disabled","color"]),i(a,{onClick:e[4]||(e[4]=l=>t(o).chain().focus().unsetAllMarks().run())},{default:r(()=>[n(" clear marks ")]),_:1}),i(a,{onClick:e[5]||(e[5]=l=>t(o).chain().focus().clearNodes().run())},{default:r(()=>[n(" clear nodes ")]),_:1}),i(a,{color:t(o).isActive("paragraph")?"primary":"",onClick:e[6]||(e[6]=l=>t(o).chain().focus().setParagraph().run())},{default:r(()=>[n(" paragraph ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("heading",{level:1})?"primary":"",onClick:e[7]||(e[7]=l=>t(o).chain().focus().toggleHeading({level:1}).run())},{default:r(()=>[n(" h1 ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("heading",{level:2})?"primary":"",onClick:e[8]||(e[8]=l=>t(o).chain().focus().toggleHeading({level:2}).run())},{default:r(()=>[n(" h2 ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("heading",{level:3})?"primary":"",onClick:e[9]||(e[9]=l=>t(o).chain().focus().toggleHeading({level:3}).run())},{default:r(()=>[n(" h3 ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("heading",{level:4})?"primary":"",onClick:e[10]||(e[10]=l=>t(o).chain().focus().toggleHeading({level:4}).run())},{default:r(()=>[n(" h4 ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("heading",{level:5})?"primary":"",onClick:e[11]||(e[11]=l=>t(o).chain().focus().toggleHeading({level:5}).run())},{default:r(()=>[n(" h5 ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("heading",{level:6})?"primary":"",onClick:e[12]||(e[12]=l=>t(o).chain().focus().toggleHeading({level:6}).run())},{default:r(()=>[n(" h6 ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("bulletList")?"primary":"",onClick:e[13]||(e[13]=l=>t(o).chain().focus().toggleBulletList().run())},{default:r(()=>[n(" bullet list ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("orderedList")?"primary":"",onClick:e[14]||(e[14]=l=>t(o).chain().focus().toggleOrderedList().run())},{default:r(()=>[n(" ordered list ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("codeBlock")?"primary":"",onClick:e[15]||(e[15]=l=>t(o).chain().focus().toggleCodeBlock().run())},{default:r(()=>[n(" code block ")]),_:1},8,["color"]),i(a,{color:t(o).isActive("blockquote")?"primary":"",onClick:e[16]||(e[16]=l=>t(o).chain().focus().toggleBlockquote().run())},{default:r(()=>[n(" blockquote ")]),_:1},8,["color"]),i(a,{onClick:e[17]||(e[17]=l=>t(o).chain().focus().setHorizontalRule().run())},{default:r(()=>[n(" horizontal rule ")]),_:1}),i(a,{onClick:e[18]||(e[18]=l=>t(o).chain().focus().setHardBreak().run())},{default:r(()=>[n(" hard break ")]),_:1}),i(a,{disabled:!t(o).can().chain().focus().undo().run(),onClick:e[19]||(e[19]=l=>t(o).chain().focus().undo().run())},{default:r(()=>[n(" undo ")]),_:1},8,["disabled"]),i(a,{disabled:!t(o).can().chain().focus().redo().run(),onClick:e[20]||(e[20]=l=>t(o).chain().focus().redo().run())},{default:r(()=>[n(" redo ")]),_:1},8,["disabled"])])):k("",!0),i(E,{class:"my-4"}),i(t(A),{editor:t(o)},null,8,["editor"])]))}},T={},q={},F={__name:"editors",setup(c){return(o,p)=>{const e=w,l=b,d=I;return s(),h(B,null,{default:r(()=>[i(f,{cols:"12"},{default:r(()=>[i(l,{title:"Basic Editor",code:T},{default:r(()=>[i(e)]),_:1},8,["code"])]),_:1}),i(f,{cols:"12"},{default:r(()=>[i(l,{title:"Custom Editor",code:q},{default:r(()=>[i(d)]),_:1},8,["code"])]),_:1})]),_:1})}}};export{F as default};
