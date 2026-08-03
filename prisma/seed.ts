import * as bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {
	constructor() {
		console.log(process.env.DATABASE_URL);

		const connectionString = `${process.env.DATABASE_URL}`;
		const adapter = new PrismaPg({ connectionString });
		super({ adapter });
	}
}

async function main() {
	const prisma: PrismaService = new PrismaService();

	const users = await prisma.user.createManyAndReturn({
		data: [
			{
				username: "dnguyen1",
				passwordHash: await bcrypt.hash("!Admin123", 16),
				displayName: "Shiroe Kuroha",
				createdAt: new Date("2003-01-08"),
			},
			{
				username: "asmith1",
				passwordHash: await bcrypt.hash("Spring#2024", 16),
				displayName: "Alice Smith",
				createdAt: new Date("2002-03-14"),
			},
			{
				username: "bjohnson1",
				passwordHash: await bcrypt.hash("Ocean!Blue7", 16),
				displayName: "Benjamin Johnson",
				createdAt: new Date("2001-07-22"),
			},
			{
				username: "clee1123",
				passwordHash: await bcrypt.hash("Cherry@Pie9", 16),
				displayName: "Charlotte Lee",
				createdAt: new Date("2000-11-05"),
			},
			{
				username: "dwilson1",
				passwordHash: await bcrypt.hash("Rocket$2025", 16),
				displayName: "Daniel Wilson",
				createdAt: new Date("1999-09-18"),
			},
			{
				username: "egarcia1",
				passwordHash: await bcrypt.hash("Sunrise#88", 16),
				displayName: "Emma Garcia",
				createdAt: new Date("2004-06-30"),
			},
			{
				username: "fmartin1",
				passwordHash: await bcrypt.hash("Forest!Green1", 16),
				displayName: "Frank Martin",
				createdAt: new Date("1998-12-12"),
			},
			{
				username: "gharris1",
				passwordHash: await bcrypt.hash("Galaxy@Star3", 16),
				displayName: "Grace Harris",
				createdAt: new Date("2003-02-28"),
			},
			{
				username: "ihall122",
				passwordHash: await bcrypt.hash("Purple#Rain6", 16),
				displayName: "Isaac Hall",
				createdAt: new Date("2005-10-09"),
			},
			{
				username: "jyoung12",
				passwordHash: await bcrypt.hash("Tiger$Claw4", 16),
				displayName: "Julia Young",
				createdAt: new Date("2002-08-16"),
			},
			{
				username: "kthomas11",
				passwordHash: await bcrypt.hash("Coffee!Bean8", 16),
				displayName: "Kevin Thomas",
				createdAt: new Date("2001-04-03"),
			},
			{
				username: "lwalker124",
				passwordHash: await bcrypt.hash("Moon@Light2", 16),
				displayName: "Lily Walker",
				createdAt: new Date("1999-01-25"),
			},
			{
				username: "mrobinson1",
				passwordHash: await bcrypt.hash("Dragon#Fire5", 16),
				displayName: "Michael Robinson",
				createdAt: new Date("2000-05-11"),
			},
			{
				username: "n4clark1",
				passwordHash: await bcrypt.hash("Winter$Snow9", 16),
				displayName: "Natalie Clark",
				createdAt: new Date("2004-09-27"),
			},
			{
				username: "owright1",
				passwordHash: await bcrypt.hash("Phoenix@Rise7", 16),
				displayName: "Oliver Wright",
				createdAt: new Date("2003-12-19"),
			},
			{
				username: "rpperez1",
				passwordHash: await bcrypt.hash("Voyager!123", 16),
				displayName: "Penelope Perez",
				createdAt: new Date("2001-02-07"),
			},
		],
	});

	console.log(users);

	await prisma.$disconnect();
}

main()
	.catch((error) => {
		console.log("Seed Error: " + error);
	})
	.finally(() => {
		console.log("Database seeded!");
	});
