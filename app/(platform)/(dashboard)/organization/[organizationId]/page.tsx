import { auth } from "@clerk/nextjs";

const OrganizationIdPage = () => {

    const { userId, orgId } = auth();

    return (
        <div>
            {orgId} <br/>
            {userId}
        </div>
    )
}

export default OrganizationIdPage;