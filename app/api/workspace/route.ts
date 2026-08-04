import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { activities, clients, projects, tasks } from "../../../db/schema";

const now = () => new Date().toISOString();
const text = (value: unknown) => value == null ? "" : String(value).trim();

async function logActivity(db: Awaited<ReturnType<typeof getDb>>, action:string, entity:string, entityId:number|null, message:string) {
  await db.insert(activities).values({ action, entity, entityId, message, createdAt: now() });
}

export async function GET() {
  try {
    const db = await getDb();
    const [clientRows, projectRows, taskRows, activityRows] = await Promise.all([
      db.select().from(clients).orderBy(asc(clients.name)),
      db.select().from(projects).orderBy(desc(projects.createdAt)),
      db.select().from(tasks).orderBy(asc(tasks.dueDate), desc(tasks.createdAt)),
      db.select().from(activities).orderBy(desc(activities.createdAt)).limit(100),
    ]);
    return Response.json({ clients: clientRows, projects: projectRows, tasks: taskRows, activities: activityRows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load workspace" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json() as Record<string, unknown>;
  const entity = text(body.entity);
  try {
    if (entity === "task") {
      const title = text(body.title);
      if (!title) return Response.json({ error: "Task title is required" }, { status: 400 });
      const projectId = body.projectId ? Number(body.projectId) : null;
      let clientId = body.clientId ? Number(body.clientId) : null;
      if (!clientId && projectId) {
        const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
        clientId = project?.clientId ?? null;
      }
      const [row] = await db.insert(tasks).values({
        title, status: text(body.status) || "Next", priority: text(body.priority) || "Medium",
        type: text(body.type) || "Standard", dueDate: body.dueDate ? text(body.dueDate) : null,
        projectId, clientId, notes: text(body.notes), estimatedMinutes: Number(body.estimatedMinutes || 30), createdAt: now(),
      }).returning();
      await logActivity(db, "created", "task", row.id, `Created task “${row.title}”`);
      return Response.json({ item: row }, { status: 201 });
    }
    if (entity === "client") {
      const name = text(body.name);
      if (!name) return Response.json({ error: "Client name is required" }, { status: 400 });
      const [row] = await db.insert(clients).values({ name, contact:text(body.contact), email:text(body.email), services:text(body.services), website:text(body.website), phone:text(body.phone), notes:text(body.notes), lastContact:body.lastContact ? text(body.lastContact) : null, createdAt:now() }).returning();
      await logActivity(db, "created", "client", row.id, `Added client “${row.name}”`);
      return Response.json({ item: row }, { status: 201 });
    }
    if (entity === "project") {
      const name = text(body.name);
      if (!name || !body.clientId) return Response.json({ error: "Project name and client are required" }, { status: 400 });
      const [row] = await db.insert(projects).values({ clientId:Number(body.clientId), name, status:text(body.status)||"Active", health:text(body.health)||"Green", progress:Number(body.progress||0), dueDate:body.dueDate?text(body.dueDate):null, nextAction:text(body.nextAction), description:text(body.description), priority:text(body.priority)||"Medium", createdAt:now() }).returning();
      await logActivity(db, "created", "project", row.id, `Started project “${row.name}”`);
      return Response.json({ item: row }, { status: 201 });
    }
    return Response.json({ error: "Unknown entity" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const db = await getDb();
  const body = await request.json() as Record<string, unknown>;
  try {
    if (body.entity === "task" && body.id) {
      const changes: Record<string, string | number | null> = {};
      for (const key of ["title","status","priority","type","dueDate","notes"] as const) if (key in body) changes[key] = body[key] == null ? null : text(body[key]);
      for (const key of ["projectId","clientId","estimatedMinutes"] as const) if (key in body) changes[key] = body[key] ? Number(body[key]) : null;
      if ("status" in body) changes.completedAt = body.status === "Done" ? now() : null;
      const [row] = await db.update(tasks).set(changes).where(eq(tasks.id, Number(body.id))).returning();
      await logActivity(db, "updated", "task", row.id, body.status === "Done" ? `Completed task “${row.title}”` : `Updated task “${row.title}”`);
      return Response.json({ item: row });
    }
    if (body.entity === "project" && body.id) {
      const changes: Record<string, string | number | null> = {};
      for (const key of ["name","status","health","nextAction","dueDate","description","priority"] as const) if (key in body) changes[key] = body[key] == null ? null : text(body[key]);
      if ("progress" in body) changes.progress = Number(body.progress);
      if ("clientId" in body) changes.clientId = Number(body.clientId);
      const [row] = await db.update(projects).set(changes).where(eq(projects.id, Number(body.id))).returning();
      await logActivity(db, "updated", "project", row.id, `Updated project “${row.name}”`);
      return Response.json({ item: row });
    }
    if (body.entity === "client" && body.id) {
      const changes: Record<string, string | number | null> = {};
      for (const key of ["name","contact","email","services","website","phone","notes","lastContact","status"] as const) if (key in body) changes[key] = body[key] == null ? null : text(body[key]);
      const [row] = await db.update(clients).set(changes).where(eq(clients.id, Number(body.id))).returning();
      await logActivity(db, "updated", "client", row.id, `Updated client “${row.name}”`);
      return Response.json({ item: row });
    }
    return Response.json({ error: "Unsupported update" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const db = await getDb();
  const body = await request.json() as Record<string, unknown>;
  if (body.entity !== "task" || !body.id) return Response.json({ error:"Only tasks can be deleted" }, { status:400 });
  const [row] = await db.delete(tasks).where(eq(tasks.id, Number(body.id))).returning();
  if (row) await logActivity(db, "deleted", "task", row.id, `Removed task “${row.title}”`);
  return Response.json({ item:row });
}
