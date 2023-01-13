"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[494],{1494:(Y,S,s)=>{s.r(S),s.d(S,{ShopModule:()=>l});var a=s(6895),Z=s(4466),f=s(5825);class y{constructor(){this.brandId=0,this.typeId=0,this.sort="name",this.pageNumber=1,this.pageSize=6}}var t=s(1571),x=s(529),v=s(9646),b=s(4004);class O{constructor(){this.data=[]}}class p{constructor(n){this.http=n,this.baseUrl="api",this.brands=[],this.types=[],this.pagination=new O,this.shopParams=new y,this.productCache=new Map}getProducts(n){if(!1===n&&(this.productCache=new Map),this.productCache.size>0&&!0===n&&this.productCache.has(Object.values(this.shopParams).join("-")))return this.pagination.data=this.productCache.get(Object.values(this.shopParams).join("-")),console.log(Object.values(this.shopParams).join("-")),(0,v.of)(this.pagination);let e=new x.LE;return 0!==this.shopParams.brandId&&(e=e.append("brandId",this.shopParams.brandId.toString())),0!==this.shopParams.typeId&&(e=e.append("typeId",this.shopParams.typeId.toString())),this.shopParams.search&&(e=e.append("search",this.shopParams.search)),e=e.append("sort",this.shopParams.sort),e=e.append("pageIndex",this.shopParams.pageNumber.toString()),e=e.append("pageSize",this.shopParams.pageSize.toString()),this.http.get(this.baseUrl+"/products",{observe:"response",params:e}).pipe((0,b.U)(i=>(this.productCache.set(Object.values(this.shopParams).join("-"),i.body.data),this.pagination=i.body,this.pagination)))}setShopParams(n){this.shopParams=n}getShopParams(){return this.shopParams}getProduct(n){let e;return this.productCache.forEach(i=>{e=i.find(r=>r.id===n)}),e?(0,v.of)(e):this.http.get(this.baseUrl+"/products/"+n)}getBrands(){return this.brands.length>0?(0,v.of)(this.brands):this.http.get(this.baseUrl+"/products/brands").pipe((0,b.U)(n=>(this.brands=n,n)))}getTypes(){return this.types.length>0?(0,v.of)(this.types):this.http.get(this.baseUrl+"/products/types").pipe((0,b.U)(n=>(this.types=n,this.types)))}}function N(o,n){if(1&o&&(t.TgZ(0,"span"),t._uU(1," Showing "),t.TgZ(2,"strong"),t._uU(3),t.qZA(),t._uU(4," of "),t.TgZ(5,"strong"),t._uU(6),t.qZA(),t._uU(7," results "),t.qZA()),2&o){const e=t.oxw();t.xp6(3),t.AsE(" ",(e.pageNumber-1)*e.pageSize+1," - ",e.pageNumber*e.pageSize>e.totalCount?e.totalCount:e.pageNumber*e.pageSize," "),t.xp6(3),t.Oqu(e.totalCount)}}function k(o,n){1&o&&(t.TgZ(0,"span"),t._uU(1," There are "),t.TgZ(2,"strong"),t._uU(3,"0"),t.qZA(),t._uU(4," results for this filter "),t.qZA())}p.\u0275fac=function(n){return new(n||p)(t.LFG(x.eN))},p.\u0275prov=t.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"});class d{ngOnInit(){}}d.\u0275fac=function(n){return new(n||d)},d.\u0275cmp=t.Xpm({type:d,selectors:[["app-paging-header"]],inputs:{pageNumber:"pageNumber",pageSize:"pageSize",totalCount:"totalCount"},decls:3,vars:2,consts:[[4,"ngIf"]],template:function(n,e){1&n&&(t.TgZ(0,"header"),t.YNc(1,N,8,3,"span",0),t.YNc(2,k,5,0,"span",0),t.qZA()),2&n&&(t.xp6(1),t.Q6J("ngIf",e.totalCount&&e.totalCount>0),t.xp6(1),t.Q6J("ngIf",0===e.totalCount))},dependencies:[a.O5]});var I=s(2521),C=s(433);class h{constructor(){this.pageChanged=new t.vpe}ngOnInit(){}onPagerChange(n){this.pageChanged.emit(n.page)}}h.\u0275fac=function(n){return new(n||h)},h.\u0275cmp=t.Xpm({type:h,selectors:[["app-pager"]],inputs:{totalCount:"totalCount",pageSize:"pageSize",pageNumber:"pageNumber"},outputs:{pageChanged:"pageChanged"},decls:1,vars:4,consts:[["previousText","\u2039","nextText","\u203a","firstText","\xab","lastText","\xbb",3,"boundaryLinks","totalItems","ngModel","itemsPerPage","pageChanged"]],template:function(n,e){1&n&&(t.TgZ(0,"pagination",0),t.NdJ("pageChanged",function(r){return e.onPagerChange(r)}),t.qZA()),2&n&&t.Q6J("boundaryLinks",!0)("totalItems",e.totalCount)("ngModel",e.pageNumber)("itemsPerPage",e.pageSize)},dependencies:[I.Qt,C.JJ,C.On]});var T=s(8607);class g{constructor(n){this.basketService=n}ngOnInit(){}addItemToBasket(){this.basketService.addItemToBasket(this.product)}}g.\u0275fac=function(n){return new(n||g)(t.Y36(T.v))},g.\u0275cmp=t.Xpm({type:g,selectors:[["app-product-item"]],inputs:{product:"product"},decls:14,vars:9,consts:[[1,"card","h-100","shadow-sm"],[1,"image","position-relative"],[1,"img-fluid","bg-info",3,"routerLink","src","alt"],[1,"d-flex","align-items-center","justify-content-center","hover-overlay"],["type","button",1,"btn","btn-primary","fa","fa-shopping-cart","mr-2",3,"click"],["type","button",1,"btn","btn-primary",3,"routerLink"],[1,"card-body","d-flex","flex-column"],[3,"routerLink"],[1,"text-uppercase"],[1,"mb-2"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"div",1),t._UZ(2,"img",2),t.TgZ(3,"div",3)(4,"button",4),t.NdJ("click",function(){return e.addItemToBasket()}),t.qZA(),t.TgZ(5,"button",5),t._uU(6,"View"),t.qZA()()(),t.TgZ(7,"div",6)(8,"a",7)(9,"h6",8),t._uU(10),t.qZA()(),t.TgZ(11,"span",9),t._uU(12),t.ALo(13,"currency"),t.qZA()()()),2&n&&(t.xp6(2),t.MGl("routerLink","/shop/",e.product.id,""),t.s9C("src",e.product.pictureUrl,t.LSH),t.s9C("alt",e.product.name),t.xp6(3),t.MGl("routerLink","/shop/",e.product.id,""),t.xp6(3),t.MGl("routerLink","/shop/",e.product.id,""),t.xp6(2),t.Oqu(e.product.name),t.xp6(2),t.Oqu(t.lcZ(13,7,e.product.price)))},dependencies:[f.rH,a.H9],styles:[".btn[_ngcontent-%COMP%]{width:30%;height:40px}.image[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover{opacity:1;cursor:pointer}.image[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:hover   button[_ngcontent-%COMP%]{transform:none;opacity:1}.hover-overlay[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%;top:0;left:0;opacity:0;background:rgba(255,255,255,.5);transition:all .5s}.hover-overlay[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{z-index:1000;transition:all .5s}.hover-overlay[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:first-of-type{transform:translate(-20px)}.hover-overlay[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:last-of-type{transform:translate(20px)}"]});const w=["search"];function M(o,n){if(1&o&&(t.TgZ(0,"option",16),t._uU(1),t.qZA()),2&o){const e=n.$implicit,i=t.oxw(2);t.Q6J("selected",i.shopParams.sort===e.value)("value",e.value),t.xp6(1),t.hij(" ",e.name," ")}}function U(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"li",17),t.NdJ("click",function(){const c=t.CHM(e).$implicit,P=t.oxw(2);return t.KtG(P.onBrandSelected(c.id))}),t._uU(1),t.qZA()}if(2&o){const e=n.$implicit,i=t.oxw(2);t.ekj("active",e.id===i.shopParams.brandId),t.Q6J("value",e.id),t.xp6(1),t.hij(" ",e.name," ")}}function q(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"li",17),t.NdJ("click",function(){const c=t.CHM(e).$implicit,P=t.oxw(2);return t.KtG(P.onTypeSelected(c.id))}),t._uU(1),t.qZA()}if(2&o){const e=n.$implicit,i=t.oxw(2);t.ekj("active",e.id===i.shopParams.typeId),t.Q6J("value",e.id),t.xp6(1),t.hij(" ",e.name," ")}}function J(o,n){if(1&o){const e=t.EpF();t.ynx(0),t.TgZ(1,"h5",10),t._uU(2,"Sort"),t.qZA(),t.TgZ(3,"select",11),t.NdJ("change",function(r){t.CHM(e);const c=t.oxw();return t.KtG(c.onSortSelected(r.target.value))}),t.YNc(4,M,2,3,"option",12),t.qZA(),t.TgZ(5,"h5",13),t._uU(6,"Brands"),t.qZA(),t.TgZ(7,"ul",14),t.YNc(8,U,2,4,"li",15),t.qZA(),t.TgZ(9,"h5",13),t._uU(10,"Types"),t.qZA(),t.TgZ(11,"ul",14),t.YNc(12,q,2,4,"li",15),t.qZA(),t.BQk()}if(2&o){const e=t.oxw();t.xp6(4),t.Q6J("ngForOf",e.sortOptions),t.xp6(4),t.Q6J("ngForOf",e.brands),t.xp6(4),t.Q6J("ngForOf",e.types)}}function z(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"div",18)(1,"input",19,20),t.NdJ("keyup.enter",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.onSearch())}),t.qZA(),t.TgZ(3,"button",21),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.onSearch())}),t._uU(4,"Search"),t.qZA(),t.TgZ(5,"button",22),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.onReset())}),t._uU(6,"Reset"),t.qZA()()}}function F(o,n){if(1&o&&(t.TgZ(0,"div",23),t._UZ(1,"app-product-item",24),t.qZA()),2&o){const e=n.$implicit;t.xp6(1),t.Q6J("product",e)}}function Q(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"div",25)(1,"app-pager",26),t.NdJ("pageChanged",function(r){t.CHM(e);const c=t.oxw();return t.KtG(c.onPageChanged(r))}),t.qZA()()}if(2&o){const e=t.oxw();t.xp6(1),t.Q6J("pageSize",e.shopParams.pageSize)("pageNumber",e.shopParams.pageNumber)("totalCount",e.totalProductCount)}}class m{constructor(n){this.shopService=n,this.sortOptions=[{name:"Alphabetical",value:"name"},{name:"Price: Low to High",value:"priceAsync"},{name:"Price: High to Low",value:"priceDesc"}],this.shopParams=this.shopService.getShopParams()}ngOnInit(){this.getProducts(!0),this.getBrands(),this.getTypes()}getProducts(n=!1){this.shopService.getProducts(n).subscribe({next:e=>{this.products=e.data,this.totalProductCount=e.count},error:e=>console.log(e)})}getBrands(){this.shopService.getBrands().subscribe({next:n=>this.brands=[{name:"All",id:0},...n],error:n=>console.log(n)})}getTypes(){this.shopService.getTypes().subscribe({next:n=>this.types=[{name:"All",id:0},...n],error:n=>console.log(n)})}onBrandSelected(n){const e=this.shopService.getShopParams();e.brandId=n,e.pageNumber=1,this.shopService.setShopParams(e),this.getProducts()}onTypeSelected(n){const e=this.shopService.getShopParams();e.typeId=n,e.pageNumber=1,this.shopService.setShopParams(e),this.getProducts()}onSortSelected(n){const e=this.shopService.getShopParams();e.sort=n,this.shopService.setShopParams(e),this.getProducts()}onPageChanged(n){const e=this.shopService.getShopParams();e.pageNumber!==n&&(e.pageNumber=n,this.shopService.setShopParams(e),this.getProducts(!0))}onSearch(){const n=this.shopService.getShopParams();n.search=this.searchTerm.nativeElement.value,n.pageNumber=1,this.shopService.setShopParams(n),this.getProducts()}onReset(){this.searchTerm.nativeElement.value="",this.shopParams=new y,this.shopService.setShopParams(this.shopParams),this.getProducts()}}m.\u0275fac=function(n){return new(n||m)(t.Y36(p))},m.\u0275cmp=t.Xpm({type:m,selectors:[["app-shop"]],viewQuery:function(n,e){if(1&n&&t.Gf(w,5),2&n){let i;t.iGM(i=t.CRH())&&(e.searchTerm=i.first)}},decls:11,vars:7,consts:[[1,"container","mt-3"],[1,"row"],[1,"col-3"],[4,"ngIf"],[1,"col-9"],[1,"d-flex","justify-content-between","align-items-center","pb-2"],[3,"pageNumber","pageSize","totalCount"],["class","form-inline",4,"ngIf"],["class","col-4 mb-4",4,"ngFor","ngForOf"],["class","d-flex justify-content-center",4,"ngIf"],[1,"text-warning","ml-3","mt-4","mb-3"],[1,"custom-select","mb-4",3,"change"],[3,"selected","value",4,"ngFor","ngForOf"],[1,"text-warning","ml-3"],[1,"list-group","my-3"],["class","list-group-item","role","button",3,"active","value","click",4,"ngFor","ngForOf"],[3,"selected","value"],["role","button",1,"list-group-item",3,"value","click"],[1,"form-inline"],["placeholder","Search","type","text",1,"form-control","mr-2",2,"width","300px",3,"keyup.enter"],["search",""],[1,"btn","btn-outline-primary","my-2",3,"click"],[1,"btn","btn-outline-success","ml-2","my-2",3,"click"],[1,"col-4","mb-4"],[3,"product"],[1,"d-flex","justify-content-center"],[3,"pageSize","pageNumber","totalCount","pageChanged"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"div",1)(2,"section",2),t.YNc(3,J,13,3,"ng-container",3),t.qZA(),t.TgZ(4,"section",4)(5,"div",5),t._UZ(6,"app-paging-header",6),t.YNc(7,z,7,0,"div",7),t.qZA(),t.TgZ(8,"div",1),t.YNc(9,F,2,1,"div",8),t.qZA(),t.YNc(10,Q,2,3,"div",9),t.qZA()()()),2&n&&(t.xp6(3),t.Q6J("ngIf",e.types&&e.brands),t.xp6(3),t.Q6J("pageNumber",e.shopParams.pageNumber)("pageSize",e.shopParams.pageSize)("totalCount",e.totalProductCount),t.xp6(1),t.Q6J("ngIf",e.products),t.xp6(2),t.Q6J("ngForOf",e.products),t.xp6(1),t.Q6J("ngIf",e.totalProductCount&&e.totalProductCount>0))},dependencies:[a.sg,a.O5,d,h,C.YN,C.Kr,g],styles:[".list-group-item[_ngcontent-%COMP%]{cursor:pointer;border:none;padding:10px 20px;font-size:1.1em}.list-group-item[_ngcontent-%COMP%]:focus{outline:none}.list-group-item.active[_ngcontent-%COMP%]{border-radius:10px}.list-group-item[_ngcontent-%COMP%]:not(.active):hover{color:#fff;background-color:#e95620b4;border-radius:10px}"]});var H=s(8909);function j(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"div",2)(1,"div",3),t._UZ(2,"img",4),t.qZA(),t.TgZ(3,"div",5)(4,"h3"),t._uU(5),t.qZA(),t.TgZ(6,"p",6),t._uU(7),t.ALo(8,"currency"),t.qZA(),t.TgZ(9,"div",7)(10,"i",8),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.decrementQuantity())}),t.qZA(),t.TgZ(11,"span",9),t._uU(12),t.qZA(),t.TgZ(13,"i",10),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.incrementQuantity())}),t.qZA(),t.TgZ(14,"button",11),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.addItemToBasket())}),t._uU(15,"Add to Cart"),t.qZA()()(),t.TgZ(16,"div",5)(17,"h4"),t._uU(18,"Description"),t.qZA(),t.TgZ(19,"p"),t._uU(20),t.qZA()()()}if(2&o){const e=t.oxw();t.xp6(2),t.s9C("src",e.product.pictureUrl,t.LSH),t.s9C("alt",e.product.name),t.xp6(3),t.Oqu(e.product.name),t.xp6(2),t.Oqu(t.lcZ(8,6,e.product.price)),t.xp6(5),t.Oqu(e.quantity),t.xp6(8),t.Oqu(e.product.description)}}class _{constructor(n,e,i,r){this.shopService=n,this.activatedRoute=e,this.bcService=i,this.basketService=r,this.quantity=1,this.bcService.set("@productDetails"," ")}ngOnInit(){this.loadProduct()}loadProduct(){this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get("id")).subscribe({next:n=>{this.product=n,this.bcService.set("@productDetails",this.product.name)},error:n=>console.log(n)})}addItemToBasket(){this.basketService.addItemToBasket(this.product,this.quantity)}incrementQuantity(){this.quantity++}decrementQuantity(){this.quantity>1&&this.quantity--}}_.\u0275fac=function(n){return new(n||_)(t.Y36(p),t.Y36(f.gz),t.Y36(H.pm),t.Y36(T.v))},_.\u0275cmp=t.Xpm({type:_,selectors:[["app-product-details"]],decls:2,vars:1,consts:[[1,"container","mt-5"],["class","row",4,"ngIf"],[1,"row"],[1,"col-4","d-flex","justify-content-center"],[1,"img-fluid",2,"width","150px",3,"src","alt"],[1,"col-4"],[2,"font-size","1.25em"],[1,"d-flex","justify-content-start","align-items-center"],[1,"fa","fa-minus-circle","text-warning","mr-2",2,"cursor","pointer","font-size","2em",3,"click"],[1,"font-weight-bold",2,"font-size","1.5em"],[1,"fa","fa-plus-circle","text-warning","mx-2",2,"cursor","pointer","font-size","2em",3,"click"],[1,"btn","btn-outline-primary","ml-4",3,"click"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0),t.YNc(1,j,21,8,"div",1),t.qZA()),2&n&&(t.xp6(1),t.Q6J("ngIf",e.product))},dependencies:[a.O5,a.H9]});const B=[{path:"",component:m},{path:":id",component:_,data:{breadcrumb:{alias:"productDetails"}}}];class u{}u.\u0275fac=function(n){return new(n||u)},u.\u0275mod=t.oAB({type:u}),u.\u0275inj=t.cJS({imports:[f.Bz.forChild(B),f.Bz]});class l{}l.\u0275fac=function(n){return new(n||l)},l.\u0275mod=t.oAB({type:l}),l.\u0275inj=t.cJS({imports:[a.ez,Z.m,u]})}}]);