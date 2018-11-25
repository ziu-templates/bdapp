/**
 * Created by Gary.zhou on 2017/7/3.
 */
let pipe = require('./pipe.js'),
    events = {};
class EventEmit {
	constructor() {}

	get events() {
		return {
			'noevt': [function() {}]
		};
	}

	on({evt = 'noevt', handle} = {}) {
		let events = this.events;
		delete this.events;
		let event = events[evt];
		if (!event) {
			event = [];
		}
		if (typeof handle !== 'function') {
			throw new Error(`Event Handle Not a Function in ${evt}!`);
		}
		event.push(handle);
		events[evt] = event;
		Object.defineProperty(this, 'events', {
			get() {
				return events;
			},
			configurable: true
		});
	}

	emit({evt = 'noevt', data = {}, handle = function() {}} = {}) {
		if (!evt || evt === 'noevt') {
			console.warn('The event name Not Input! You will emit the default event!!');
		} 
		this.pipe({
				evt,
				data
			})
            .catch(function(err) {
                handle(err);
            })
			.then(function() {
                handle(null, this.source);
			});
	}

	remove({evt} = {}) {
		if (!evt && !this.events[evt]) {
			return console.error('Please Input correct Event Name in remove Function!!');
		}
		delete this.events[evt];
	}

	pipe(opts) {
		let eventHandles = this.events[opts.evt],
			pipeObj = pipe({
            data: {
                body: opts.data,
                source: null
            }
        })
		if (!Array.isArray(eventHandles)) {
			console.log(`Event Not Have Correct Handle! Event Name: ${opts.evt}!!`);
			return pipeObj;
		}
        pipeObj.next(function() {
				eventHandles.forEach(function (event) {
					pipeObj.next(function() {
						let isAsync = false,
							requestObj = {
								source: this.source,
								body: this.body
							},
							responseObj = {
								end: (function(_this) {
									return function(err, source) {
										isAsync = true;
										if (err) {
											return _this.step(err);
										}
										_this.source = source;
										_this.step();
									};
								})(this)
							},
							source = event(requestObj, responseObj);
						if (!isAsync && typeof source !== 'undefined' && source !== null) {
							this.source = source;
							this.step();
						}
					});
				});
				this.step();
			});
		return pipeObj;
	}
}
module.exports = EventEmit;
// let testEvt = new EventEmit();
// testEvt.on({
// 	evt: 'test',
// 	handle: function (req, res) {
// 		console.log(req);
// 		console.log(res);
// 		setTimeout(function() {
// 			res.end(null, 'source');
// 		}, 5000);
// 	}
// });
// testEvt.on({
// 	evt: 'test',
// 	handle: function (req, res) {
// 		console.log(2);
// 		console.log(req);
// 		return 'test2';
// 	}
// });
// testEvt.on({
// 	evt: 'test',
// 	handle: function (req, res) {
// 		console.log(3);
// 		return 'test3';
// 	}
// });
// testEvt.emit({
// 	evt: 'test',
// 	data: {
// 		obj: 123
// 	},
// 	handle(err, res) {
// 		console.log(4);
// 		console.log(err);
// 	}
// });
// console.log(testEvt.events);