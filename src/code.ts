import { BehaviorSubject, from, Observable } from 'rxjs'
import { share } from 'rxjs/operators'
import { fromEvent } from 'rxjs'
import { Subject } from 'rxjs'
import { ReplaySubject } from 'rxjs';
import { AsyncSubject } from 'rxjs'; 



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
      (x:any)=> addItem2(x)
  )
  setTimeout(() => {
    subscription.unsubscribe()
  },26)
},2000)


function addItem2(val: any) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("output").appendChild(node);
}

// * SUBJECT !! 
// ! is another type of  OBSERVER with different capabilities! 
// It is not only able to observe but also emit, its an OBSERVER AND OBSERVABLE simultaneously.
// normally an observer can only read valuse emitted from an observable, this guy can also emit.

/**
//! OBSERVABLE   VS   SUBJECT   VS    REPLAY-SUBJECT   VS   BEHAVIOR-SUBJECT
/*
* OBSERVABLE:
/ - can Emit multiple values!
/ - OBSERVER is SCOPED to the Observable constructor! , .next() cannot be accessed outside of the contructor. default Observables are COLD / LAZY, will not run any code until SUBSRIBED TO.
/ - do not share work between subscribers. multiple subscribers run the same code. 

* SUBJECT:
/ - can Emit multiple values!
/ - Allow subscribers to push back OR trigger own events on the Subject.
/ - OBSERVER is NOT SCOPED to the Observable constructor!  next() CAN BE run immedietly, outside of constructor.
/ - Anyone can trigger or listen to events on the Subject, even before a subscription
/ - share work between ALL subscribers

* REPLAY-SUBJECT:
    * A variant of Subject that "replays" or emits old values to new subscribers.
    * It buffers a set number of values and will emit those values immediately to
    * any new subscribers in addition to emitting new values to existing subscribers.

* BEHAVIOR-SUBJECT:
    * A variant of Subject that requires an initial value and emits its current
    * value whenever it is subscribed to.
* ASYNC SUBJECT
    * A variant of Subject that only emits a value when it completes. It will emit
    * its latest value to all its observers on completion.

*/

//---

const subjectMissed = new Subject();
subjectMissed.next('missed message BEFORE subscription');
subjectMissed.subscribe(v => addItem(v));
subjectMissed.next('S U B J E C T: hello AFTER subscription!');

//----

const replaySubject = new ReplaySubject(); 
const replaySubjectOne = new ReplaySubject(1); // YOU CAN SPECIFY how many last 2 events it will 
const replaySubjectTwo = new ReplaySubject(5,90); // YOU CAN SPECIFY how many last 2 events and timeframe from start of emission
replaySubject.next('R-E-P-L-A-Y SUBJECT: BEFORE subscription');
var a = replaySubject.subscribe(v => addItem("A --> " + v));
replaySubject.next('R-E-P-L-A-Y SUBJECT: AFTER subscription A');
var b = replaySubject.subscribe(v => addItem("B --> " + v));
replaySubject.next('R-E-P-L-A-Y SUBJECT: AFTER subscription B');

//---- A, AA, B, BA, AB, BB  


// ------
replaySubjectOne.next("RL1-b4-Sub 1");
replaySubjectOne.next("RL1-b4-Sub 2");
replaySubjectOne.next("RL1-b4-Sub 3");
var rl1A = replaySubjectOne.subscribe(v => addItem("rl1A --> " + v));
replaySubjectOne.next("RL1-after-Sub1 1");
replaySubjectOne.next("RL1-after-Sub1 2");
replaySubjectOne.next("RL1-after-Sub1 3");
var rl1B= replaySubjectOne.subscribe(v => addItem("rl1B --> " + v));
replaySubjectOne.next("RL1-after-Sub2 1");
replaySubjectOne.next("RL1-after-Sub2 2");
replaySubjectOne.next("RL1-after-Sub2 3");
// ------

var rlFive200 = replaySubjectTwo.subscribe(v => addItem("rlFive200 --> " + v));
var i = 1;

var int = setInterval(() =>replaySubjectTwo.next(i++),100);
var rlFive200v2;
setTimeout(() => {
    rlFive200v2 = replaySubjectTwo.subscribe(v => addItem("rlFive200v2 --> " + v))
},500)

setTimeout(() => {
    rlFive200v2 = replaySubjectTwo.unsubscribe();
},2010)

// ---------

const behaviorSubject = new BehaviorSubject(
                        'B.E.H.A.V.I.O.R Subj: Before C sub'
);
var c = behaviorSubject.subscribe(v => addItem("C ==> " + v))
behaviorSubject.next(   'B.E.H.A.V.I.O.R Subj: AFTER C SUB, but before D SUB');
var d = behaviorSubject.subscribe(v => addItem("D ==> " + v))
behaviorSubject.next(   'B.E.H.A.V.I.O.R Subj: AFTER D SUB');

//---- 


const asyncSubject = new AsyncSubject()

asyncSubject.subscribe(
  data => addItem(" <><><><> ASYNC ob 1 = " + data ),
  () => addItem( " <><><><> ASYNC C O M P L E T E")
)
var j =1;
var jnt = setInterval(() => asyncSubject.next(j++),100)



setTimeout(() => {
    var as2obs = asyncSubject.subscribe(
        data => addItem(" <><><><> ASYNC ob 2 = " + data )
        )
    asyncSubject.complete(); // ! Completion needed for emission. ! 
},500)

//





var subject = new Subject();

var subjectObserver1 = subject.subscribe(
    data => addItem(" Observer 1: " + data),
    err => addItem(err),
    () => addItem("Observer 1 Completed")
)

subject.next("Yeeeet!")

var subjectObserver2 = subject.subscribe(
    data => addItem(" OBSERVER 2: " + data),
)

subject.next("Yeeeet  2!")
subject.next("Yeeeet  3!")

subjectObserver2.unsubscribe();

subject.next("Yeeeet  4!")


function addItem(val: any) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("output").appendChild(node);
}