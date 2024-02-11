import { auth } from "@clerk/nextjs";
import { db } from "./db";

const DAY_IN_MS = 84_400_000;

export const checkSubscription = async () => {
    const { orgId } = auth();

    if (!orgId) {
        return false;
    };

    const orgSubsription = await db.orgSubscription.findUnique({
        where: {
            orgId,
        },
        select: {
            stripeSubstriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!orgSubsription) {
        return false;
    };

    const isValid = 
        orgSubsription.stripePriceId &&
        orgSubsription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
}