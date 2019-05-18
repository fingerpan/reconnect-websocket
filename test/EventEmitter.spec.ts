

import EventEmitter from '../src/EventEmitter'


class EventEmitterChild extends EventEmitter {
        constructor() {
            super()
        }
        public $emit (name:string, ...args:any[]) {
            this._emit(name, ...args)
        }
};

const testEventName = 'EventName'


interface ValueMap {
    [propName: string]:any;
    valueOne: any;
    valueTwo: any;
    valueThree: any;
}

describe('on function return off funtion and it work', function() {
    let testValue:any = 0
    const setValue =(i:any)=> testValue = i;
    let off: () => void
    let EventChildInstall:EventEmitterChild
    beforeEach(function () {
        EventChildInstall = new EventEmitterChild()
    })

    afterEach(function() {
        testValue = 0
    })
    
    it('return an off function and it work', function() {
        off = EventChildInstall.on(testEventName, setValue)
        console.log(off)
        // expect on return an off function
        expect(off).toEqual(jasmine.any(Function))

        // expect emit is work 
        EventChildInstall.$emit(
            testEventName,
            1
        )
        expect(testValue).toBe(1);

        // expect off can work
        off()
        EventChildInstall.$emit(
            testEventName,
            2
        )
        expect(testValue).toBe(1);
    })

    

    it('on function work', function() {
        let valueMap:ValueMap = {
            valueOne: 0,
            valueTwo: 0,
            valueThree: 0
        }
        const setValueFactory = (propName: string) => (i:any) => valueMap[propName] = i
        
        EventChildInstall.on(testEventName, setValueFactory('valueOne'))
        EventChildInstall.on(testEventName, setValueFactory('valueTwo'))
        EventChildInstall.on(testEventName, setValueFactory('valueThree'))
        EventChildInstall.$emit(
            testEventName,
            1
        )
        expect(valueMap.valueOne).toBe(1);
        expect(valueMap.valueTwo).toBe(1);
        expect(valueMap.valueThree).toBe(1);
    })
})


describe('off function can work', function() {
    let testValue:any = 0
    const setValue =(i:any)=> testValue = i;
    let EventChildInstall:EventEmitterChild

    beforeEach(function () {
        EventChildInstall = new EventEmitterChild()
    })

    afterEach(function() {
        testValue = 0
    })
    // off
    it('off function can work', function() {
        let valueMap:ValueMap = {
            valueOne: 0,
            valueTwo: 0,
            valueThree: 0
        }
        const setValueFactory = (propName: string) => (i:any) => valueMap[propName] = i
        const setValueOne = setValueFactory('valueOne')
        const setValueTwo = setValueFactory('valueTwo')

        EventChildInstall.on(testEventName, setValueOne)
        EventChildInstall.on(testEventName, setValueTwo)
        // it work
        EventChildInstall.off(testEventName, setValueOne)

        EventChildInstall.$emit(
            testEventName,
            1
        )
        expect(valueMap.valueOne).toBe(0);
        expect(valueMap.valueTwo).toBe(1);
    })
});

describe('emit function work normal', function() {
    let testValue:any = 0
    const setValue =(i:any)=> testValue = i;
    let EventChildInstall:EventEmitterChild

    beforeEach(function () {
        EventChildInstall = new EventEmitterChild()
    })

    afterEach(function() {
        testValue = 0
    })
    // off
    it('emit args work normal', function() {
        let valueMap:ValueMap = {
            valueOne: 0,
            valueTwo: 0,
            valueThree: 0
        }

        const setValueMap = <T>(valueOne: T, valueTwo: T, valueThree: T) => {
            valueMap.valueOne = valueOne
            valueMap.valueTwo = valueTwo
            valueMap.valueThree = valueThree
        }
        EventChildInstall.on(testEventName, setValueMap)

        EventChildInstall.$emit(
            testEventName,
            1, // valueOne
            2, // valueTwo
            3  // valueThree
        )
        expect(valueMap.valueOne).toBe(1);
        expect(valueMap.valueTwo).toBe(2);
        expect(valueMap.valueThree).toBe(3);
    })
});

describe('once function can work', function() {
    let testValue:any = 0
    const setValue =(i:any)=> testValue = i;
    let EventChildInstall:EventEmitterChild

    beforeEach(function () {
        EventChildInstall = new EventEmitterChild()
    })

    afterEach(function() {
        testValue = 0
    })
    // off
    it('once function can work', function() {
        EventChildInstall.once(testEventName, setValue)

        EventChildInstall.$emit(testEventName,1)
        EventChildInstall.$emit(testEventName,2)
        EventChildInstall.$emit(testEventName,3)
        expect(testValue).toBe(1);
    })
});