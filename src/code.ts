import { Observable } from 'rxjs'

// var observable = new Observable(function subscribe(observer:any){
//     observer.next('Hey there, im an emition from an observable being observed')  // EMITTING A VALUE! use observer.next. 
// } );
var observable = new Observable((observer: any) => {
    try {
        observer.next('Hey there, im an emition from an observable being observed');  // EMITTING A VALUE! use observer.next. 
        observer.next('How are you');  // EMITTING A VALUE! use observer.next. 
        setInterval( ()=> {observer.next('I am OK')}, 2000 )
        // observer.complete();
        // observer.next('this will not send');
    }
    catch (err) {
        observer.error(err);

    }
});

// observable.subscribe((x:any) => addItem(x)) // everytime you subscribe you create an OBSERVER, you create a subscription. 
// the observers read valuse coming from the observable. 
// obseervers are a set of callbacks that accept notifications coming from the observable: next,error,complete 
var observer = observable.subscribe(
    (x: any) => addItem(x)
    
)


var observer2 = observable.subscribe(
    (x: any) => addItem(x),
    (error: any) => addItem(error),
    () => addItem("Completed")
)

observer.add(observer2); // this will cause 'observer2' to get unsubscribed when we unsubscribe from 'observer', observer2 becomes a CHILD SUBSCRIPTION. 

setTimeout( () => {
  observer.unsubscribe()
},6005)



function addItem(val: any) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("output").appendChild(node);
}