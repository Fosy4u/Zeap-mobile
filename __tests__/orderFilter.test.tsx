import {describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import React from 'react';
import {Provider} from 'react-redux';
import renderer, {act} from 'react-test-renderer';
import store from '../src/redux/store/store';
import useOrderHook from '../src/modules/user/orders/hooks/order_hook';
import {setFilteredOrders, setOrders, setOrderStatusFilter} from '../src/modules/user/orders/slices/order_slice';

const order = (id: string, statuses: string[]) =>
  ({
    _id: id,
    orderId: id,
    productOrders: statuses.map((name, index) => ({_id: `${id}-${index}`, status: {name, value: name.toLowerCase()}})),
  }) as any;

const orders = [order('A', ['Placed']), order('B', ['Placed', 'Processing']), order('C', ['Delivered'])];

let filterOrdersByStatus: (status: string) => unknown;
const Harness = () => {
  filterOrdersByStatus = useOrderHook().filterOrdersByStatus;
  return null;
};

const visibleIds = () => store.getState().orderState.filteredOrders.map(item => item._id);

describe('order status filter', () => {
  let tree: renderer.ReactTestRenderer;

  beforeEach(async () => {
    await act(async () => {
      store.dispatch(setOrders(orders));
      store.dispatch(setFilteredOrders(orders));
      store.dispatch(setOrderStatusFilter('All'));
      tree = renderer.create(
        <Provider store={store}>
          <Harness />
        </Provider>,
      );
    });
  });

  afterEach(async () => {
    await act(async () => {
      tree.unmount();
    });
  });

  it('shows only orders with the chosen status', () => {
    act(() => {
      filterOrdersByStatus('Processing');
    });
    expect(visibleIds()).toEqual(['B']);
    expect(store.getState().orderState.orderStatusFilter).toBe('Processing');
  });

  it('shows an empty list when no order matches, instead of keeping the previous results', () => {
    act(() => {
      filterOrdersByStatus('Processing');
    });
    expect(visibleIds()).toEqual(['B']);

    act(() => {
      filterOrdersByStatus('Cancelled');
    });
    expect(visibleIds()).toEqual([]);
    expect(store.getState().orderState.orderStatusFilter).toBe('Cancelled');
  });

  it('brings every order back with All', () => {
    act(() => {
      filterOrdersByStatus('Cancelled');
    });
    act(() => {
      filterOrdersByStatus('All');
    });
    expect(visibleIds()).toEqual(['A', 'B', 'C']);
  });
});
