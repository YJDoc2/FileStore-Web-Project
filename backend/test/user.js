process.env.NODE_ENV = 'test';

const User = require('../models/User');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let Should = chai.should();
const expect = chai.use(chaiHttp).expect;

describe('User Register Tests', () => {
    beforeEach(done => {
        User.deleteMany({}, err => {
            done();
        });
    });

    it('Should not register incomplete details', async () => {
        let res1 = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                username: 'test'
            });

        expect(res1).to.have.status(400);
        expect(res1.body).to.be.a('object');
        expect(res1.body)
            .to.have.property('success')
            .eql(false);
        expect(res1.body).to.not.have.property('user');
        expect(res1.body).to.have.property('err');
        expect(res1.body.err).to.be.a('string');

        let res2 = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                password: 'test'
            });
        expect(res2).to.have.status(400);
        expect(res2.body).to.be.a('object');
        expect(res2.body)
            .to.have.property('success')
            .eql(false);
        expect(res2.body).to.not.have.property('user');
        expect(res2.body).to.have.property('err');
        expect(res2.body.err).to.be.a('string');
    });

    it('Should register valid user', async () => {
        let res = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                username: 'test',
                password: 'test'
            });
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body)
            .to.have.property('success')
            .eql(true);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.be.a('object');
    });

    it('Should Not register same username twice', async () => {
        let temp = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                username: 'test',
                password: 'test'
            });
        let res = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                username: 'test',
                password: 'test'
            });
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body)
            .to.have.property('success')
            .eql(false);
        expect(res.body).to.not.have.property('user');
        expect(res.body).to.have.property('err');
        expect(res.body.err).to.be.a('string');
    });
});

describe('User Login tests', () => {
    it('Should not login incomplete requests', async () => {
        let res1 = await chai
            .request(server)
            .post('/api/user/login')
            .send({ username: 'test' });

        expect(res1).to.have.status(400);
        expect(res1.body).to.be.a('object');
        expect(res1.body)
            .to.have.property('success')
            .eql(false);
        expect(res1.body).to.have.property('err');
        expect(res1.body.err).to.be.a('string');

        let res2 = await chai
            .request(server)
            .post('/api/user/login')
            .send({ password: 'test' });
        expect(res2).to.have.status(400);
        expect(res2.body).to.be.a('object');
        expect(res2.body)
            .to.have.property('success')
            .eql(false);
        expect(res2.body).to.have.property('err');
        expect(res2.body.err).to.be.a('string');
    });

    it('Should Not Login Non existent User', async () => {
        let temp = await User.deleteOne({ username: 'test' });
        let res = await chai
            .request(server)
            .post('/api/user/login')
            .send({ username: 'test', password: 'test' });
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body)
            .to.have.property('success')
            .eql(false);
        expect(res.body).to.have.property('err');
        expect(res.body.err).to.be.a('string');
    });
    it('Should Not Login User with incorrect password', async () => {
        let temp = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                username: 'test',
                password: 'test'
            });
        let res = await chai
            .request(server)
            .post('/api/user/login')
            .send({ username: 'test', password: 'ntest' });
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body)
            .to.have.property('success')
            .eql(false);
        expect(res.body).to.have.property('err');
        expect(res.body.err).to.be.a('string');
        temp = await User.deleteOne({ username: 'test' });
    });
    it('Should allow correct Login', async () => {
        let temp = await chai
            .request(server)
            .post('/api/user/register')
            .send({
                username: 'test',
                password: 'test'
            });
        let res = await chai
            .request(server)
            .post('/api/user/login')
            .send({ username: 'test', password: 'test' });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body)
            .to.have.property('success')
            .eql(true);
        expect(res).to.have.cookie('connect.sid');
        temp = await User.deleteOne({ username: 'test' });
    });
});
