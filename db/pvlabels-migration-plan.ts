import { and, eq } from "drizzle-orm";
import { activities, clients, projects, tasks } from "./schema";

const SEED_MARKER = "PV Labels migration plan seeded v1";

const shopifyTasks = [
  ["Confirm BigCommerce -> Shopify migration scope and source-of-truth rules", "Done", "High", "Planning"],
  ["Create and retain BigCommerce export/backups before migration work", "Done", "High", "Data"],
  ["Migrate product catalog to Shopify", "Done", "High", "Data"],
  ["Migrate customer records to Shopify", "Done", "High", "Data"],
  ["Migrate historical orders needed for Shopify reference", "Done", "Medium", "Data"],
  ["Validate Shopify product SKUs against BigCommerce", "Done", "High", "QA"],
  ["Preserve BigCommerce percentage quantity-break semantics", "Done", "High", "Pricing"],
  ["Select quantity-break app and validate CSV/import path", "Done", "High", "Pricing"],
  ["Decide discount stacking behavior for free shipping and partner codes", "Next", "High", "Pricing"],
  ["Rebuild PV Labels header in Shopify theme", "Done", "High", "Theme"],
  ["Rebuild PV Labels footer in Shopify theme", "Done", "High", "Theme"],
  ["Rebuild collection layout and faceted filtering", "Done", "High", "Theme"],
  ["Validate mobile two-column collection cards", "Done", "Medium", "QA"],
  ["Fix desktop menu dropdown alignment", "Next", "High", "Theme"],
  ["Migrate Solar Placement Guide page", "Done", "Medium", "Content"],
  ["Migrate Support page", "Done", "Medium", "Content"],
  ["Migrate Contact Us page", "Done", "Medium", "Content"],
  ["Migrate FAQs page", "Done", "Medium", "Content"],
  ["Migrate About Us page", "Done", "Medium", "Content"],
  ["Migrate Shipping & Returns page", "Done", "Medium", "Content"],
  ["Migrate Privacy Policy page", "Done", "Medium", "Content"],
  ["Migrate Materials page", "Done", "Medium", "Content"],
  ["Rebuild PDP structure and PV Labels product styling", "Done", "High", "Theme"],
  ["Create normalized product specification metafields", "Done", "High", "Data"],
  ["Backfill product specification metafields", "Done", "High", "Data"],
  ["Add Wave 1 custom product text modifiers", "Done", "High", "Product Options"],
  ["Implement remaining custom modifier waves", "Backlog", "High", "Product Options"],
  ["Implement custom file-upload product option", "Backlog", "High", "Product Options"],
  ["Build homepage banners and carousel", "Next", "High", "Theme"],
  ["Capture and validate all category landing pages", "Backlog", "Medium", "QA"],
  ["Validate homepage image fit and responsive behavior", "Done", "Medium", "QA"],
  ["Confirm all BigCommerce categories map to Shopify collections/navigation", "Next", "High", "Data"],
  ["Audit product images and missing media", "Next", "High", "Data"],
  ["Audit product options, modifiers, and variant pricing", "Next", "High", "QA"],
  ["Configure Shopify shipping methods to replace BigCommerce native shipping", "Next", "High", "Integration"],
  ["Configure ShipStation integration with Shopify", "Next", "High", "Integration"],
  ["Connect UPS/USPS/FedEx carrier accounts in ShipStation as required", "Next", "Medium", "Integration"],
  ["Configure Avalara Tax Compliance for Shopify", "Next", "High", "Integration"],
  ["Validate taxable and tax-exempt Shopify orders through Avalara", "Next", "High", "QA"],
  ["Select and configure Shopify ecommerce payment processor", "Next", "High", "Integration"],
  ["Configure Shopify -> Zoho Books sales synchronization boundary", "Backlog", "High", "Integration"],
  ["Prevent migrated historical Shopify orders from duplicating Zoho history", "Backlog", "High", "Integration"],
  ["Create URL redirect map from BigCommerce URLs to Shopify URLs", "Next", "High", "SEO"],
  ["Validate page titles, meta descriptions, canonicals, and indexability", "Next", "High", "SEO"],
  ["Validate structured data and product SEO after migration", "Backlog", "Medium", "SEO"],
  ["Run desktop and mobile regression QA across core templates", "Next", "High", "QA"],
  ["Run checkout test for normal paid order", "Backlog", "High", "Launch"],
  ["Run checkout test for tax-exempt customer", "Backlog", "High", "Launch"],
  ["Run checkout test for discount/quantity-break order", "Backlog", "High", "Launch"],
  ["Run ShipStation fulfillment and tracking write-back test", "Backlog", "High", "Launch"],
  ["Validate transactional emails and order notifications", "Backlog", "Medium", "Launch"],
  ["Create final Shopify theme backup before publish", "Backlog", "High", "Launch"],
  ["Publish approved Shopify theme", "Backlog", "High", "Launch"],
  ["Point production domain/DNS to Shopify at cutover", "Backlog", "High", "Launch"],
  ["Monitor orders, redirects, tax, payments, and shipping after launch", "Backlog", "High", "Post-Launch"],
  ["Archive BigCommerce as historical source after successful cutover", "Backlog", "Medium", "Post-Launch"],
] as const;

const zohoTasks = [
  ["Confirm QuickBooks Desktop -> Zoho Books migration scope", "Next", "High", "Planning"],
  ["Set 12-month historical transaction migration window", "Next", "High", "Planning"],
  ["Include every still-open transaction even if older than one year", "Next", "High", "Planning"],
  ["Confirm active customers plus all customers referenced by migrated transactions", "Next", "High", "Planning"],
  ["Select Zoho Books plan and user access", "Next", "High", "Setup"],
  ["Create Zoho Books organization and configure company settings", "Backlog", "High", "Setup"],
  ["Configure Quotes, Sales Orders, Invoices, Payments, Credit Notes, and Net 30 terms", "Backlog", "High", "Setup"],
  ["Disable automated customer reminders/emails during migration", "Backlog", "High", "Setup"],
  ["Confirm no product inventory tracking will be used", "Next", "Medium", "Setup"],
  ["Confirm no bank-reconciliation migration is required", "Next", "Medium", "Setup"],
  ["Create final QuickBooks Desktop company backup", "Backlog", "High", "Data"],
  ["Create second off-device QuickBooks backup", "Backlog", "High", "Data"],
  ["Export QuickBooks Item List with sales and purchase fields", "Backlog", "High", "Data"],
  ["Export active Customer Contact List", "Backlog", "High", "Data"],
  ["Export Vendor Contact List", "Backlog", "High", "Data"],
  ["Export one year of Estimates with line-item detail", "Backlog", "High", "Data"],
  ["Export one year of Sales Orders with line-item detail", "Backlog", "High", "Data"],
  ["Export one year of Invoices with line-item detail", "Backlog", "High", "Data"],
  ["Export all older open invoices", "Backlog", "High", "Data"],
  ["Export customer payments for migrated invoices", "Backlog", "High", "Data"],
  ["Export partial and unapplied customer payments", "Backlog", "High", "Data"],
  ["Export customer credits, credit memos, and refunds", "Backlog", "High", "Data"],
  ["Export customer balance/open-invoice control reports", "Backlog", "High", "Data"],
  ["Create master QuickBooks -> Zoho mapping workbook", "Backlog", "High", "Data Mapping"],
  ["Map QuickBooks customers to Zoho customers", "Backlog", "High", "Data Mapping"],
  ["Map vendors and vendor purchase information", "Backlog", "Medium", "Data Mapping"],
  ["Map all PV Labels SKUs to Zoho non-inventory items", "Backlog", "High", "Data Mapping"],
  ["Map vendor item numbers, purchase descriptions, and purchase costs", "Backlog", "Medium", "Data Mapping"],
  ["Map Avalara product tax codes and customer exemption information", "Backlog", "High", "Data Mapping"],
  ["Clean duplicate customers and normalize company/contact names", "Backlog", "High", "Data Cleanup"],
  ["Clean duplicate, blank, retired, or malformed item/SKU records", "Backlog", "High", "Data Cleanup"],
  ["Validate transaction numbers, dates, terms, PO numbers, shipping, tax, and totals", "Backlog", "High", "Data Cleanup"],
  ["Import test customers into Zoho Books", "Backlog", "High", "Test Migration"],
  ["Import test vendors into Zoho Books", "Backlog", "Medium", "Test Migration"],
  ["Import test items into Zoho Books", "Backlog", "High", "Test Migration"],
  ["Import test Quotes into Zoho Books", "Backlog", "High", "Test Migration"],
  ["Import test Sales Orders into Zoho Books", "Backlog", "High", "Test Migration"],
  ["Import test Invoices into Zoho Books", "Backlog", "High", "Test Migration"],
  ["Import test Payments Received and apply them to invoices", "Backlog", "High", "Test Migration"],
  ["Import test Credit Notes/refunds", "Backlog", "High", "Test Migration"],
  ["Verify imported Invoice -> Sales Order links", "Backlog", "Medium", "Test Migration"],
  ["Decide how historical Quote -> Sales Order relationships will be represented", "Backlog", "Medium", "Test Migration"],
  ["Verify historical QuickBooks document numbers are preserved", "Backlog", "High", "Test Migration"],
  ["Reconcile test customer balances QuickBooks vs Zoho", "Backlog", "High", "Reconciliation"],
  ["Reconcile one-year sales totals QuickBooks vs Zoho", "Backlog", "High", "Reconciliation"],
  ["Reconcile one-year payment totals QuickBooks vs Zoho", "Backlog", "High", "Reconciliation"],
  ["Reconcile paid, partially paid, and unpaid invoice statuses", "Backlog", "High", "Reconciliation"],
  ["Configure Avalara AvaTax integration in Zoho Books", "Backlog", "High", "Integration"],
  ["Confirm Zoho Sales Receipts module remains disabled for Avalara", "Backlog", "High", "Integration"],
  ["Prevent historical Zoho imports from duplicating Avalara transactions", "Backlog", "High", "Integration"],
  ["Test taxable Zoho invoice through Avalara", "Backlog", "High", "QA"],
  ["Test tax-exempt Zoho customer through Avalara", "Backlog", "High", "QA"],
  ["Select Stripe or Zoho Payments for direct Zoho invoice payments", "Next", "High", "Integration"],
  ["Configure direct invoice payment gateway in Zoho Books", "Backlog", "High", "Integration"],
  ["Test full, partial, manual, declined, and refunded invoice payments", "Backlog", "High", "QA"],
  ["Create/confirm dedicated GoDaddy Microsoft 365 mailbox for Zoho outbound email", "Next", "High", "Integration"],
  ["Configure Zoho Books outbound email using GoDaddy Microsoft 365/Outlook", "Backlog", "High", "Integration"],
  ["Test Quote email delivery and replies through Outlook", "Backlog", "High", "QA"],
  ["Test Invoice, payment receipt, statement, and attachment delivery", "Backlog", "High", "QA"],
  ["Verify SPF, DKIM, DMARC, and deliverability for Zoho transactional email", "Backlog", "High", "QA"],
  ["Configure Shopify -> Zoho Books connector/middleware", "Backlog", "High", "Integration"],
  ["Set Shopify -> Zoho synchronization start boundary at cutover", "Backlog", "High", "Integration"],
  ["Map Shopify customer, SKU, tax, shipping, discount, and payment fields to Zoho", "Backlog", "High", "Integration"],
  ["Test normal paid Shopify order into Zoho", "Backlog", "High", "QA"],
  ["Test unpaid/Net 30 Shopify order into Zoho", "Backlog", "High", "QA"],
  ["Test Shopify cancellation, refund, and partial refund into Zoho", "Backlog", "High", "QA"],
  ["Verify Shopify order/payment is created only once in Zoho", "Backlog", "High", "QA"],
  ["Confirm ShipStation remains connected to Shopify rather than Zoho accounting flow", "Backlog", "Medium", "Integration"],
  ["Run full QuickBooks -> Zoho dress rehearsal using final mapping", "Backlog", "High", "Dress Rehearsal"],
  ["Document import counts, rejected rows, corrections, and re-import results", "Backlog", "High", "Dress Rehearsal"],
  ["Complete dress-rehearsal reconciliation and approve cutover procedure", "Backlog", "High", "Dress Rehearsal"],
  ["Freeze QuickBooks transaction entry for final cutover", "Backlog", "High", "Cutover"],
  ["Create final cutover QuickBooks backup and exports", "Backlog", "High", "Cutover"],
  ["Import final Customers -> Vendors -> Items -> Quotes -> Sales Orders -> Invoices -> Payments -> Credits/Refunds", "Backlog", "High", "Cutover"],
  ["Resolve all final import errors and rejected rows", "Backlog", "High", "Cutover"],
  ["Complete final customer balance reconciliation", "Backlog", "High", "Cutover"],
  ["Complete final one-year sales/payment reconciliation", "Backlog", "High", "Cutover"],
  ["Enable Avalara, Microsoft 365 email, payment gateway, and Shopify connector", "Backlog", "High", "Launch"],
  ["Run first live direct Quote -> Sales Order -> Invoice workflow", "Backlog", "High", "Launch"],
  ["Run first live Net 30 invoice workflow", "Backlog", "High", "Launch"],
  ["Run first live online-payment workflow", "Backlog", "High", "Launch"],
  ["Run first live Shopify -> Zoho sales/payment workflow", "Backlog", "High", "Launch"],
  ["Monitor duplicate sales, payments, tax commits, and email delivery after launch", "Backlog", "High", "Post-Launch"],
  ["Set QuickBooks Desktop to historical/read-only use", "Backlog", "Medium", "Post-Launch"],
  ["Archive final QBB, migration exports, mapping workbook, and reconciliation reports", "Backlog", "Medium", "Post-Launch"],
] as const;

export async function seedPvLabelsMigrationPlan(db: any) {
  const existingMarker = await db.select().from(activities).where(and(eq(activities.entity, "migration-plan"), eq(activities.message, SEED_MARKER))).limit(1);
  if (existingMarker.length) return;

  const timestamp = new Date().toISOString();
  let [client] = await db.select().from(clients).where(eq(clients.name, "PV Labels")).limit(1);
  if (!client) {
    [client] = await db.insert(clients).values({
      name: "PV Labels",
      contact: "Operations",
      services: "Shopify · Zoho Books · Avalara · ShipStation · Automation",
      website: "pvlabels.com",
      notes: "PV Labels ecommerce, accounting, shipping, tax, and operations workspace.",
      status: "Active",
      createdAt: timestamp,
    }).returning();
  }

  async function getOrCreateProject(name: string, description: string, progress: number, nextAction: string) {
    let [project] = await db.select().from(projects).where(and(eq(projects.clientId, client.id), eq(projects.name, name))).limit(1);
    if (!project) {
      [project] = await db.insert(projects).values({
        clientId: client.id,
        name,
        status: "Active",
        health: "Yellow",
        progress,
        nextAction,
        description,
        priority: "High",
        createdAt: timestamp,
      }).returning();
    }
    return project;
  }

  const shopifyProject = await getOrCreateProject(
    "BigCommerce -> Shopify Migration",
    "Complete the PV Labels storefront, data, pricing, tax, payment, shipping, SEO, QA, and production cutover from BigCommerce to Shopify.",
    68,
    "Finish remaining theme, integration, SEO, and launch-readiness tasks"
  );
  const zohoProject = await getOrCreateProject(
    "QuickBooks Desktop -> Zoho Books Migration",
    "Migrate PV Labels sales and payment operations from QuickBooks Desktop to Zoho Books, including products, active/referenced customers, vendor purchase items, one year of Quotes/Estimates, Sales Orders, Invoices, Payments, Credits, and integrations.",
    2,
    "Configure Zoho Books organization and prepare QuickBooks export/mapping package"
  );

  async function addTaskSet(project: any, rows: readonly (readonly [string, string, string, string])[]) {
    for (const [title, status, priority, type] of rows) {
      const existing = await db.select().from(tasks).where(and(eq(tasks.projectId, project.id), eq(tasks.title, title))).limit(1);
      if (existing.length) continue;
      await db.insert(tasks).values({
        projectId: project.id,
        clientId: client.id,
        title,
        status,
        priority,
        type,
        notes: `PV Labels migration task - ${type}`,
        estimatedMinutes: priority === "High" ? 60 : 30,
        createdAt: timestamp,
        completedAt: status === "Done" ? timestamp : null,
      });
    }
  }

  await addTaskSet(shopifyProject, shopifyTasks);
  await addTaskSet(zohoProject, zohoTasks);
  await db.insert(activities).values({
    action: "seeded",
    entity: "migration-plan",
    entityId: client.id,
    message: SEED_MARKER,
    createdAt: timestamp,
  });
}
