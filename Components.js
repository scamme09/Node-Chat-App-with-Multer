class Components{
    constructor(head, body, foot,data){
        this.head = head;
        this.body = body;
        this.foot = foot;
        this.data = data;
        this.render = function(){ 
            return head.render() + body.render(data) + foot.render();  
        }
    }
}
 
module.exports = Components;