import { firestore } from 'firebase-admin'
import { WithId } from '../../type'
import { Log } from '../../Log'
import { readSnapshot } from '../readSnapshot'

interface FirstoreGetOptions<Args = undefined> {
  // The collection path to add the document to.
  // This can be a string or a function that returns a string based on the parts
  // passed into the action.
  // (see the advanced example in src/actions/add/index.ts)
  collectionPath: string | ((args: Args) => string)
  debugName?: string
}

export const firestoreGet = <T, A = undefined>({
  collectionPath,
  debugName = 'document',
}: FirstoreGetOptions<A>) => async (id: string, args: A) => {
  try {
    Log.breadcrumb(`getting ${debugName} with id "${id}"`)

    const doc = await firestore()
      .collection(
        typeof collectionPath === 'string'
          ? collectionPath
          : collectionPath(args),
      )
      .doc(id)
      .get()

    return doc.exists ? readSnapshot<WithId<T>>(doc) : undefined
  } catch (error) {
    Log.error(error)
    throw error
  }
}
