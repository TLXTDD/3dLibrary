var project = {
    num: 125,//存储li的个数
    lastyDeg: 0,
    lastxDeg: 0,
    size:0,
    helixInfo:{  //螺旋体场景的参数
        n:3,
        moveZ:800,
        y:20
    },
    squareInfo:{//矩阵场景的参数
        x:180,
        y:180,
        z:300,
    },
    tableInfo:{//元素周期表的参数
        x:150,
        y:200,
    },
    circleInfo:{  //球形场景的参数
        r:800
    },
    $(select) {
        return document.querySelector(select);
    },
    init() {
        //创建num个li
        this.createItems();
        this.setItems();

        this.$('ul').addEventListener('mousedown',this.handleMousedown.bind(this));
        document.addEventListener('mousewheel',this.handleMousewheel.bind(this));

        // this.$('#square').addEventListener('click',this.square.bind(this));
        // this.$('#helix').addEventListener('click',this.helix.bind(this));
        // this.$('#table').addEventListener('click',this.table.bind(this));
        // this.$('#circle').addEventListener('click',this.circle.bind(this));

        this.$('.list').addEventListener('click',this.handleClick.bind(this))
    },
    setItems(){
        for(var i=0;i<this.num;i++){
            var x = Math.random()*4000-2000;//[-2000,2000]
            var y = Math.random()*4000-2000;
            var z = Math.random()*4000-2000;
            var str = `translate3D(${x}px,${y}px,${z}px)`;
            this.aLi[i].style.transform = str;
        }

        //开场后排成矩阵
        // setTimeout(this.square.bind(this),1000)
        setTimeout(()=>{
            this.square()
        },1000)
    },
    handleClick(e){
        var id = e.target.id;

        if(id)this[id]()
    },
    random(){
        var arr = [];
        for (var i=0;i<this.num;i++) arr.push(i)

        arr.sort((a,b)=>Math.random()-0.5);

        for (var j=0;j<this.num;j++){
            var styleObj = getComputedStyle(this.aLi[j]).transform;

            this.aLi[arr[j]].style.transform = styleObj
        }
    },
    circle(){
        var arr = [1, 3, 7, 9, 11, 14, 21, 20, 12, 10, 9, 7, 1];// 每一层有多少个li
        var n = 0;
        var length = arr.length
        const {r} = this.circleInfo;
        for(var i=0;i<length;i++){  //循环length次
            var num = arr[i];   //存储每一层li的个数
            for(var j=0;j<num;j++){  //循环每一层li的个数
                var yDeg = 360*j/num;   //计算每一层li的y轴旋转角度
                var xDeg = 90+180*i/(length-1);
                var str =  `rotateY(${yDeg}deg) rotateX(${xDeg}deg) translateZ(${r}px)`;
                this.aLi[n++].style.transform = str;
            }
        }
    },
    //元素周期表
    table(){
        var arr = [
            { x: -8, y: -3 },  //第一个li的位置信息
            { x: 9, y: -3 },
            { x: -8, y: -2 },
            { x: -7, y: -2 },
            { x: 4, y: -2 },
            { x: 5, y: -2 },
            { x: 6, y: -2 },
            { x: 7, y: -2 },
            { x: 8, y: -2 },
            { x: 9, y: -2 },
            { x: -8, y: -1 },
            { x: -7, y: -1 },
            { x: 4, y: -1 },
            { x: 5, y: -1 },
            { x: 6, y: -1 },
            { x: 7, y: -1 },
            { x: 8, y: -1 },
            { x: 9, y: -1 },
        ];
        for (var i=0;i<18*6;i++){
            arr.push( {
                x:i%18-8,
                y:parseInt(i/18),
            })
        }
        var {x,y} = this.tableInfo;
        for (var a=0;a<this.num;a++){
            var str = `translateX(${arr[a].x*x}px) translateY(${arr[a].y*y}px)`;
            this.aLi[a].style.transform = str;
        }
    },
    //螺旋体场景
    helix(){
        var {n,moveZ,y} = this.helixInfo;
        for (var i=0;i<this.num;i++){
            var degY = 360*n*i/this.num;
            var moveY = parseInt(this.num/2)-i;
            this.aLi[i].style.transform = `translateY(${moveY*y}px) rotateY(${degY}deg) translateZ(${moveZ}px)`
        }
    },
    handleMousewheel(e) {
        var wheelDelta = e.wheelDelta;
        if (wheelDelta>0){
            this.size += 100;
            this.size = this.size>5000?5000:this.size;
        }else {
            this.size -=100;
            this.size = this.size<-5000?-5000:this.size;
        }
        this.$('#box').style.transform = `translateZ(${this.size}px)`
    }
    ,
    handleMousedown(e) {
        this.startX = e.clientX;
        this.startY = e.clientY;

        this.handleMousemove = this.handleMousemove.bind(this);
        this.handleMouseup = this.handleMouseup.bind(this)

        document.addEventListener('mousemove',this.handleMousemove);
        document.addEventListener('mouseup',this.handleMouseup)
    },
    handleMousemove(e) {
        this.yDeg = (e.clientX - this.startX)*0.15+this.lastyDeg;
        this.xDeg= (e.clientY - this.startY)*0.15+this.lastxDeg;

        this.$('ul').style.transform = `rotateY(${this.yDeg}deg) rotateX(${-this.xDeg}deg)`
    },
    handleMouseup() {
        document.removeEventListener('mousemove',this.handleMousemove);
        document.removeEventListener('mouseup',this.handleMouseup);
        this.lastyDeg = this.yDeg;
        this.lastxDeg = this.xDeg;
    },
    createItems() {
        this.ul = document.createElement('ul');
        for (var i = 0; i < this.num; i++) {
            var li = document.createElement('li');
            li.innerText = i;
            this.ul.appendChild(li)
        }
        this.$('#box').appendChild(this.ul);

        this.aLi=this.ul.children;
    },

    //矩阵场景
    square() {
        var {x,y,z}=this.squareInfo;
        for (var i=0;i<this.num;i++){
            var xPx = i%5-2;
            var yPx = parseInt(i%25/5)-2;
            var zPx = parseInt(i/25)-2;

            var str = `translateX(${xPx*x}px) translateY(${yPx*y}px) translateZ(${zPx*z}px) `;
            this.$('ul').children[i].style.transform = str;

        }
    },
}
    project.init();