import { getCurrentOrgCookie } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { getOrganizationBilling } from '@/http/get-organization-billing'
import { formatPrice } from '@/lib/formatters'

export async function Billing() {
  const orgCookie = await getCurrentOrgCookie()
  if (!orgCookie) return null

  const { billing } = await getOrganizationBilling(orgCookie)

  return (
    <div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardHeader>Information about your organization costs</CardHeader>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost type</TableHead>
                <TableHead className='text-right' style={{ width: 120 }}>
                  Quantity
                </TableHead>
                <TableHead className='text-right' style={{ width: 120 }}>
                  Subtotal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Amount of projects</TableCell>
                <TableCell className='text-right'>
                  {billing.projects.amount}
                </TableCell>
                <TableCell className='text-right'>
                  {formatPrice(billing.projects.price)} (
                  {formatPrice(billing.projects.unit)} each)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Amount of seats</TableCell>
                <TableCell className='text-right'>{billing.seats.amount}</TableCell>
                <TableCell className='text-right'>
                  {formatPrice(billing.seats.price)} (
                  {formatPrice(billing.seats.unit)} each)
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell className='text-right'>Total</TableCell>
                <TableCell className='text-right'>
                  {formatPrice(billing.total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
