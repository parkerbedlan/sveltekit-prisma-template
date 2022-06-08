import type { RequestHandler } from './__types';
// import { prisma } from '$lib/db/prisma-client';

const lazyPrismaLoader = async () => {
	const { PrismaClient } = await import('@prisma/client');
	const prisma = new PrismaClient();
	return prisma;
};

export const get: RequestHandler = async () => {
	const prisma = await lazyPrismaLoader();
	const todos = await prisma.todo.findMany({});
	return {
		body: {
			todos
		}
	};
};

export const post: RequestHandler = async ({ request }) => {
	const form = await request.formData();

	const prisma = await lazyPrismaLoader();
	await prisma.todo.create({ data: { done: false, text: form.get('text') as string } });

	return {};
};

// If the user has JavaScript disabled, the URL will change to
// include the method override unless we redirect back to /todos
const redirect = {
	status: 303,
	headers: {
		location: '/todos'
	}
};

export const patch: RequestHandler = async ({ request }) => {
	const form = await request.formData();

	const prisma = await lazyPrismaLoader();
	await prisma.todo.update({
		where: { id: parseInt(form.get('id') as string) },
		data: {
			text: form.has('text') ? (form.get('text') as string) : undefined,
			done: form.has('done') ? !!form.get('done') : undefined
		}
	});

	return redirect;
};

export const del: RequestHandler = async ({ request }) => {
	const form = await request.formData();

	const prisma = await lazyPrismaLoader();
	await prisma.todo.delete({ where: { id: parseInt(form.get('id') as string) } });

	return redirect;
};
