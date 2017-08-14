import { Resource } from './index';
import 'jasmine-ajax';

// https://gist.github.com/paulsturgess/f1813e0cee2d39ea3b57ca155ec7fee7

describe('Resource', () => {

	let UrlResource, UserResource, OverrideResource, request;

	beforeEach(() => {
		jasmine.Ajax.install();
		UrlResource = new Resource('/web/:version/users/:id');
		UserResource = new Resource('/web/1.0/users/:id');
		OverrideResource = new Resource('/web/1.0/users/:id', {
			get: {
				url: '/web/2.0/users/:id'
			},
			list: {
				url: '/web/2.0/users',
				method: 'get',
				params: {
					pageSize: 10,
					pageNumber: 1
				}
			},
			save: {
				method: 'put'
			}
		});
	});

	afterEach(() => {
		request = null;
		jasmine.Ajax.uninstall();
		UrlResource = null;
		UserResource = null;
		OverrideResource = null;
	});

	it('defaultActions', () => {
		expect(Resource.defaultActions).toBeDefined();
	});

	it('url test - 1', (done) => {
		UrlResource.get({id: 9527, version: '2.0', keyword: 'happy'})
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/2.0/users/9527?keyword=happy');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK'
			});
		}, 0);
	});

	it('url test - 2', (done) => {
		UrlResource.get({id: 9527, keyword: 'happy'})
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/users/9527?keyword=happy');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK'
			});
		}, 0);
	});

	it('get success', (done) => {
		UserResource.get({id: 9527})
			.then(result => {
				expect(result.data).toBe('foo');
				expect(result.status).toBe(200);
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users/9527');
			expect(request.method).toBe('GET');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': 'foo'
			});
		}, 0);
	});

	it('get failure', (done) => {
		UserResource.get({id: 9527})
			.catch(error => {
				expect(error.response.status).toBe(500);
				expect(error.response.statusText).toBe('HTTP/1.1 500 Error');
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			request.respondWith({
				'status': 500,
				'statusText': 'HTTP/1.1 500 Error',
				'contentType': 'text/plain'
			});
		}, 0);
	});

	it('save success', (done) => {
		UserResource.save(null, {name: 'harry', age: '24'})
			.then(result => {
				expect(result.data.id).toBe(9527);
				expect(result.status).toBe(200);
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users');
			expect(request.method).toBe('POST');
			expect(request.data()).toEqual({name: 'harry', age: '24'});
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('query success', (done) => {
		UserResource.query({name: 'harry', age: '24'})
			.then(result => {
				expect(result.data.id).toBe(9527);
				expect(result.status).toBe(200);
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users?name=harry&age=24');
			expect(request.method).toBe('GET');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('update success', (done) => {
		UserResource.update({id: 9527}, {id: 9527, name: 'harry', age: '24'})
			.then(result => {
				expect(result.data.id).toBe(9527);
				expect(result.status).toBe(200);
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users/9527');
			expect(request.method).toBe('PUT');
			expect(request.data()).toEqual({id: 9527, name: 'harry', age: '24'});
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('remove success', (done) => {
		UserResource.remove({id: '9527'})
			.then(result => {
				expect(result.data.id).toBe(9527);
				expect(result.status).toBe(200);
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users/9527');
			expect(request.method).toBe('DELETE');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('customize resource', (done) => {
		OverrideResource.get({id: '9527'})
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/2.0/users/9527');
			expect(request.method).toBe('GET');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('customize resource - 1', (done) => {
		OverrideResource.list({ keywords: 'harry' })
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/2.0/users?keywords=harry&pageSize=10&pageNumber=1');
			expect(request.method).toBe('GET');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('customize resource - 2', (done) => {
		OverrideResource.list(null, {url: 'no used', params: { keywords: 'harry' }})
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/2.0/users?pageSize=10&pageNumber=1&keywords=harry');
			expect(request.method).toBe('GET');
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});

	it('customize resource - 3', (done) => {
		OverrideResource.save(null, { name: 'harry', age: 28 })
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users');
			expect(request.method).toBe('PUT');
			expect(request.data()).toEqual({ name: 'harry', age: 28 });
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});
	it('customize resource - 4', (done) => {
		OverrideResource.save(null, { name: 'harry', age: 28 }, {url: 'no used', data: { grade: 90 }})
			.then(() => {
				done();
			});
		setTimeout(function () {
			request = jasmine.Ajax.requests.mostRecent();
			expect(request.url).toBe('/web/1.0/users');
			expect(request.method).toBe('PUT');
			expect(request.data()).toEqual({ name: 'harry', age: 28, grade: 90 });
			request.respondWith({
				'status': 200,
				'statusText': 'HTTP/1.1 200 OK',
				'contentType': 'text/plain',
				'responseText': {id: 9527}
			});
		}, 0);
	});
});
