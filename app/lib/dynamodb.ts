import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

export type TransactionRecord = {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  payer: string;
};

export type MemoRecord = {
  id: string;
  date: string;
  title: string;
  body: string;
  tag: "info" | "alert";
};

const region = process.env.AWS_REGION ?? "ap-northeast-1";
const transactionsTable = process.env.DYNAMODB_TRANSACTIONS_TABLE ?? "";
const memosTable = process.env.DYNAMODB_MEMOS_TABLE ?? "";
const partitionKey = process.env.DYNAMODB_PARTITION_KEY ?? "month";
const sortKey = process.env.DYNAMODB_SORT_KEY ?? "entryId";
const recordTypeKey = process.env.DYNAMODB_RECORD_TYPE_KEY ?? "recordType";

const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client);

const ensureTable = (tableName: string) => {
  if (!tableName) {
    throw new Error("DynamoDB table name is not configured.");
  }
};

const buildEntryId = (date: string, id: string) => `${date}#${id}`;

const queryByMonth = async <T extends { id: string }>(
  tableName: string,
  month: string,
  recordType: string,
): Promise<T[]> => {
  ensureTable(tableName);

  const result = await docClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#pk = :month",
      FilterExpression: "#recordType = :recordType",
      ExpressionAttributeNames: {
        "#pk": partitionKey,
        "#recordType": recordTypeKey,
      },
      ExpressionAttributeValues: {
        ":month": month,
        ":recordType": recordType,
      },
    }),
  );

  return (result.Items ?? []) as T[];
};

export const listTransactionsByMonth = (month: string) =>
  queryByMonth<TransactionRecord>(transactionsTable, month, "transaction");

export const listMemosByMonth = (month: string) =>
  queryByMonth<MemoRecord>(memosTable, month, "memo");

export const createTransaction = async (
  transaction: Omit<TransactionRecord, "id">,
): Promise<TransactionRecord> => {
  ensureTable(transactionsTable);
  const id = randomUUID();
  const month = transaction.date.slice(0, 7);

  const item = {
    ...transaction,
    id,
    [partitionKey]: month,
    [sortKey]: buildEntryId(transaction.date, id),
    [recordTypeKey]: "transaction",
  };

  await docClient.send(
    new PutCommand({
      TableName: transactionsTable,
      Item: item,
    }),
  );

  return item as TransactionRecord;
};

export const createMemo = async (
  memo: Omit<MemoRecord, "id">,
): Promise<MemoRecord> => {
  ensureTable(memosTable);
  const id = randomUUID();
  const month = memo.date.slice(0, 7);

  const item = {
    ...memo,
    id,
    [partitionKey]: month,
    [sortKey]: buildEntryId(memo.date, id),
    [recordTypeKey]: "memo",
  };

  await docClient.send(
    new PutCommand({
      TableName: memosTable,
      Item: item,
    }),
  );

  return item as MemoRecord;
};
