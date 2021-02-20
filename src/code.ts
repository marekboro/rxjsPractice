import { from, Observable } from 'rxjs'
import { share } from 'rxjs/operators'
import { fromEvent } from 'rxjs'


// var observable = new Observable(function subscribe(observer:any){
//     observer.next('Hey there, im an emition from an observable being observed')  // EMITTING A VALUE! use observer.next. 
// } );
var observable = new Observable((observer: any) => {    // This is a COLD OBSERVABLE - its producer is the function  in YELLOW () brackets, as this is what emitts these values/events.
                                                        // "its observer whose producer is activated only once a subscription has been created" 
                                                        // observable is HOT when the producer is emitting  value outside of the ebservable.
    try {
        observer.next('Hey there, im an emission from an observable being observed');  // EMITTING A VALUE! use observer.next. 
        observer.next('How are you');  // EMITTING A VALUE! use observer.next. 
        setInterval( ()=> {observer.next('I am OK')}, 2000 )
        // observer.complete();
        // observer.next('this will not send');
    }
    catch (err) {
        observer.error(err);
    }

//! SWITCH which line is commented out to make the Subscriber2 a WARM / HOT observable. 
});
// }).pipe(share()) ;
//! TRULY HOT observbls would be MOUSE movememts.


// observable.subscribe((x:any) => addItemOld(x)) // everytime you subscribe you create an OBSERVER, you create a subscription. 
// the observers read valuse coming from the observable. 
// obseervers are a set of callbacks that accept notifications coming from the observable: next,error,complete 
var observer = observable.subscribe(
    (x: any) => addItemOld(x)
    
)

////
// var observer2 = observable.subscribe(
//     (x: any) => addItemOld(x),
//     (error: any) => addItemOld(error),
//     () => addItemOld("Completed")
// )
// observer.add(observer2); // this will cause 'observer2' to get unsubscribed when we unsubscribe from 'observer', observer2 becomes a CHILD SUBSCRIPTION. 
// setTimeout( () => {
//   observer.unsubscribe()
// },6005)
////
setTimeout( () => {
  var observer2 = observable.subscribe(
      (x:any)=>addItemOld('Subscriber 2 '+ x)
  )
},1000)

 

function addItemOld(val: any) {
    // var node = document.createElement("li");
    // var textnode = document.createTextNode(val);
    // node.appendChild(textnode);
    // document.getElementById("output").appendChild(node);
}

var observableHot = fromEvent(document,'mousemove')

setTimeout(() => {
  var subscription = observableHot.subscribe(
      (x:any)=> addItem(x)
  )
},2000)

function addItem(val: any) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("output").appendChild(node);
}